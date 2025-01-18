import Mongoose from "mongoose";

const chatSchema = new Mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmin: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Chat = Mongoose.model("Chat", chatSchema);

export default Chat;