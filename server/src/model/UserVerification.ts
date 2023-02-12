import mongoose from "mongoose";

const userVerification = new mongoose.Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

export default mongoose.model("UserVerification", userVerification);
