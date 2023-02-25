import mongoose from "mongoose";

const FriendRequestSchema = new mongoose.Schema(
  {
    requestedBy: {
      type: String,
    },
    requestedTo: {
      type: String,
    },
    accepted: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("FriendRequest", FriendRequestSchema);
