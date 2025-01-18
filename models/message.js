import Mongoose from "mongoose";

const messageSchema = new Mongoose.Schema(
  {
    sender: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: Mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Message = Mongoose.model("Message", messageSchema);

export default Message;