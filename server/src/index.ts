import mongoose, { Error } from "mongoose";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import passport, { use } from "passport";
import passportLocal from "passport-local";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/dbConnection";
import { corsOptions } from "./config/corsOptions";
import User from "./model/User";
import UserVerification from "./model/UserVerification";
import ResetPasswordVerification from "./model/ResetPasswordVerification";
import Conversation from "./model/Conversation";
import Message from "./model/Message";
import { IUserInterface } from "./interfaces/IUserInterface";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import { createHmac, sign } from "crypto";
import path from "path";
import bodyParser from "body-parser";
import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, ".env") });

// connect to MongoDB
connectDB();

// Start Express server
const app = express();

// nodemailer
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing success
transporter.verify((error, success) => {
  if (error) console.log(error);
  else {
    console.log(`Ready for messages\n${success}`);
  }
});

// Passport Strategy
const LocalStrategy = passportLocal.Strategy;

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// built-in middlware for json
app.use(express.json());

// express session
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);

// middleware for cookies
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

// Passport
passport.use(
  new LocalStrategy((username: string, password: string, done) => {
    User.findOne({ username: username }, (err: any, user: any) => {
      if (err) throw err;
      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, result: boolean) => {
        if (err) throw err;
        if (result === true) return done(null, user);
        else return done(null, false);
      });
    });
  })
);

passport.serializeUser((user: any, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id: string, cb) => {
  User.findOne({ _id: id }, (err: any, user: any) => {
    const userInformation: any = {
      username: user.username,
      email: user.email,
      id: user._id,
    };
    cb(err, userInformation);
  });
});

// send verification email
const sendVerificationEmail = async (result: any, res: any) => {
  const { _id, email } = result;
  // url to be used in the email
  const currentUrl = "http://localhost:3000/";

  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to complete the signup process.</p>
    <p>This link <b>expires in 6 hours.</br></p>
    <p>Click <a href=${
      currentUrl + "user/verify/?_id=" + _id + "/&uniqueString=" + uniqueString
    }>here</a> to proceed.</p>
    `,
  };

  // hash the uniqueString
  const saltRounds = 10;
  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);
    // set values in userVerification collection
    const newVerification = new UserVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 6,
    });
    await newVerification.save();
    transporter.sendMail(mailOptions);
    return res.send("pending");
  } catch (err) {
    console.log(err);
    res.send("error");
  }
};

// verify email
app.get(
  "/verifyemail/:_id/:uniqueString",
  async (req: Request, res: Response) => {
    let { _id, uniqueString } = req.params;

    // check if already verified
    User.findOne({ _id }, (err: Error, document: any) => {
      const currentVerificationStatus = document.verified;
      if (currentVerificationStatus) {
        res.send("alreadyverified");
      } else {
        UserVerification.findOne({ userId: _id }, (err: Error, doc: any) => {
          if (err) {
            res.send("searchingforverificationrecorderror");
            return;
          }
          if (!doc || doc.length == 0) {
            res.send("nouserverificationrecordexists");
            return;
          }
          // user verification record exists
          if (doc) {
            const expiresAt = doc.expiresAt.getTime();
            const currentTime = Date.now();
            const hashedUniqueString = doc.uniqueString;

            // check if link has expired
            // link has expired
            if (expiresAt < currentTime) {
              UserVerification.deleteOne(
                { userId: _id },
                async (err: Error, doc: any) => {
                  if (err) {
                    res.send("expiredlinkdeletinguserverificationrecorderror");
                    return;
                  }
                  if (doc) {
                    // delete user s.t. user has to sign up again
                    // since verification process couldn't be completed
                    await User.deleteOne({ _id });
                    res.send("expiredlink");
                    return;
                  }
                }
              );
            }
            // link is still active
            else {
              // compare hashed unique string
              bcrypt.compare(
                uniqueString,
                hashedUniqueString,
                async (err, result: boolean) => {
                  if (err) {
                    res.send("comparingerror");
                    return;
                  }
                  // string matches
                  if (result === true) {
                    try {
                      await User.updateOne({ _id }, { verified: true });
                      await UserVerification.deleteOne({ userId: _id });
                      res.send("success");
                      return;
                    } catch (err) {
                      res.send("verificationupdaterror");
                      return;
                    }
                  }
                  // string does not match
                  else {
                    res.send("incorrectlinkerror");
                    return;
                  }
                }
              );
            }
          }
        });
      }
    });
  }
);

app.get("/user/:email", async (req: Request, res: Response) => {
  const { email } = req.params;
  User.findOne({ email }, (err: Error, doc: any) => {
    if (err) throw err;
    if (!doc || doc.length == 0) {
      res.send("nosuchemailexists");
      return;
    } else {
      res.send(doc);
    }
  });
});

async function sendResetPasswordEmail(
  _id: number,
  email: string,
  res: Response
) {
  // url to be used in the email
  const currentUrl = "http://localhost:3000/";

  const uniqueString = uuidv4() + _id;

  // mail options
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Reset Your Password",
    html: `<p>We're sending you this email because you requested a password reset.</p><p>This link <b>expires in 6 hours.</br></p>
    <p>Click on <a href=${
      currentUrl + "user/reset/?_id=" + _id + "/&uniqueString=" + uniqueString
    }>this</a> link to create a new password.</p>
    <p>If you didn't request a password reset, you can ignore this email. Your password will not be changed.</p>
    `,
  };

  // hash the uniqueString
  const saltRounds = 10;
  try {
    const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds);
    // set values in userVerification collection
    const newVerification = new ResetPasswordVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 1000 * 60 * 60 * 6,
    });
    try {
      await newVerification.save();
      transporter.sendMail(mailOptions);
      res.send("pending");
      return;
    } catch (e) {
      console.log(e);
    }
  } catch (err) {
    res.send("error");
    return;
  }
}

app.post("/requestnewpassword", async (req: Request, res: Response) => {
  const { _id, email } = req?.body;

  ResetPasswordVerification.findOne(
    { userId: _id },
    (err: Error, document: any) => {
      if (err) throw err;
      if (document) {
        const expiresAt = document.expiresAt.getTime();
        const currentTime = Date.now();
        if (expiresAt > currentTime) {
          res.send("requestnewpasswordemailsentalready");
          return;
        } else {
          sendResetPasswordEmail(_id, email, res);
        }
      } else {
        sendResetPasswordEmail(_id, email, res);
      }
    }
  );
});

app.post(
  "/resetpassword/:_id/:uniqueString",
  async (req: Request, res: Response) => {
    let { _id, uniqueString } = req.params;
    let { newPassword } = req?.body;

    ResetPasswordVerification.findOne(
      { userId: _id },
      async (err: Error, doc: any) => {
        if (err) {
          res.send("searchingforresetpasswordrecorderror");
          return;
        }
        if (!doc || doc.length == 0) {
          res.send("nouresetpasswordrecordexists");
          return;
        }
        // reset password record exists
        if (doc) {
          const expiresAt = doc.expiresAt.getTime();
          const currentTime = Date.now();
          const hashedUniqueString = doc.uniqueString;

          // check if link has expired
          // link has expired
          if (expiresAt < currentTime) {
            await ResetPasswordVerification.deleteOne({ _id });
            res.send("expiredlink");
            return;
          }
          // link is still active
          else {
            // compare hashed unique string
            bcrypt.compare(
              uniqueString,
              hashedUniqueString,
              async (err, result: boolean) => {
                if (err) {
                  res.send("comparingerror");
                  return;
                }
                // string matches
                if (result === true) {
                  try {
                    const saltRounds = 10;
                    const hashedNewPassword = await bcrypt.hash(
                      newPassword,
                      saltRounds
                    );
                    await User.updateOne(
                      { _id },
                      { password: hashedNewPassword }
                    );
                    await ResetPasswordVerification.deleteOne({ userId: _id });
                    res.send("success");
                    return;
                  } catch (err) {
                    res.send("verificationupdaterror");
                    return;
                  }
                }
                // string does not match
                else {
                  res.send("incorrectlinkerror");
                  return;
                }
              }
            );
          }
        }
      }
    );
  }
);

// Routes
app.post("/register", async (req: Request, res: Response) => {
  const { userProfilePicture, username, password, email } = req?.body;
  if (
    !username ||
    !password ||
    !email ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof email !== "string"
  ) {
    res.send("ImproperValues");
    return;
  }

  User.findOne({ username }, async (err: any, doc: any) => {
    if (err) {
      throw err;
    }
    if (doc) res.send("UserAlreadyExists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        userProfilePicture,
        username,
        password: hashedPassword,
        email,
        verified: false,
      });
      try {
        const result = await newUser.save();
        // handle account verification
        sendVerificationEmail(result, res);
      } catch (err) {
        if (err.name === "MongoServerError" && err.code === 11000) {
          // Duplicate email
          res.status(400).send("EmailAlreadyExists");
        }
      }
    }
  });
});

app.post(
  "/login",
  passport.authenticate("local"),
  (req: Request, res: Response) => {
    const { username } = req.body;
    User.find({ username }, async (err: Error, doc: any) => {
      if (err) throw err;
      if (!doc[0].verified) {
        res.send("unverified");
      } else {
        res.send("success");
      }
    });
  }
);

app.get("/calculatesignature", (req: Request, res: Response) => {
  const token = uuidv4();
  const expire = (Date.now() + 60 * 30) / 1000;
  const signature = createHmac("sha1", process.env.IMAGEKITIO_PRIVATE_KEY!)
    .update(token + expire)
    .digest("hex");
  return res.send({ signature, token, expire });
});

app.get("/user", (req: Request, res: Response) => {
  const reqObj: any = req.user;
  if (reqObj?.id) {
    User.findOne({ _id: reqObj.id }, async (err: Error, doc: any) => {
      if (err) throw err;
      if (doc) res.send(doc);
    });
  } else {
    res.send(req.user);
  }
});

app.get("/findUser/:id", (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    User.findOne({ _id: userId }, async (err: Error, doc: any) => {
      if (err) console.log(err);
      if (doc) res.send(doc);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/logout", (req: Request, res: Response) => {
  req.logout(function (err) {
    if (err) throw err;
  });
  res.send("success");
});

app.post("/conversations", async (req: Request, res: Response) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/conversations/:userId", async (req: Request, res: Response) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.post("/messages", async (req: Request, res: Response) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get("/messages/:conversationId", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: 1 });
    res.status(200).send(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

app.get(
  "/messages/getlasttext/:conversationId",
  async (req: Request, res: Response) => {
    try {
      const lastText = await Message.findOne({
        conversationId: req.params.conversationId,
      })
        .sort({ createdAt: -1 })
        .limit(1);
      res.status(200).send(lastText);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

app.listen(4000, () => {
  console.log("Server Started");
});
