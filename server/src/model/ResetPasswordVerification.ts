import mongoose from "mongoose";

const resetPasswordVerification = new mongoose.Schema({
  userId: String,
  email: String,
  uniqueString: String,
  createdAt: Date,
  expiresAt: Date,
});

export default mongoose.model(
  "ResetPasswordVerification",
  resetPasswordVerification
);
