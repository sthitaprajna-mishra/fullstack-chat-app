import mongoose, { Error } from "mongoose";
import path from "path";

import * as dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "..", ".env") });

export const connectDB = async () => {
  const DB_URL = `${process.env.PART1STRING}${process.env.DBUSERNAME}:${process.env.DBPASSWORD}${process.env.PART2STRING}`;
  try {
    /*
[MONGOOSE] DeprecationWarning: Mongoose: the `strictQuery` option will be switched back to `false` by default in Mongoose 7. 
Use `mongoose.set('strictQuery', false);` if you want to prepare for this change. 
Or use `mongoose.set('strictQuery', true);` to suppress this warning.
*/
    mongoose.set("strictQuery", true);
    // Connect to DB
    await mongoose.connect(DB_URL, (err: Error) => {
      if (err) {
        console.log(DB_URL);
        throw err;
      }
      console.log("Connected to Mongo");
    });
  } catch (err) {
    console.log(err);
  }
};
