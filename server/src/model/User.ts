import mongoose from "mongoose";

const user = new mongoose.Schema({
  userProfilePicture: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "There is already an account with this email address."],
  },
  verified: {
    type: Boolean,
    required: false,
  },
});

export default mongoose.model("User", user);
