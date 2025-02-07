import Message from "../models/message.js";
import Chat from "../models/chat.js";
import User from "../models/user.js";
import io from "../server.js";

const sentMessage = async (req, res) => {
    try {
        const { message, chatId } = req.body;
        if (!message || !chatId) return res.status(400).json({ message: "All fields are required" });  
        const createdMessage = await Message.create({ content: message, chat: chatId, sender: req.user._id });
        let populatedMessage = await Message.findById(createdMessage._id)
            .populate("sender", '-password')
            .populate("chat", "users chatName");
        
        populatedMessage = await User.populate(populatedMessage, { path: "chat.users", select: "-password" });
        await Chat.findByIdAndUpdate(chatId, { latestMessage: createdMessage._id });
        io.to(chatId).emit("newMessage", populatedMessage);
        return res.status(201).json(populatedMessage);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const fetchMessages = async (req, res) => {
    const chatId = req.params.chatId;
    if(!chatId) return res.status(400).json({ message: "Chat id is required" });

    try {
        const messages = await Message.find({ chat: chatId })
            .populate("sender", "-password")
            .populate("chat", "users chatName");

        let populatedMessages = await User.populate(messages, { path: "chat.users", select: "-password" });
        return res.status(200).json(populatedMessages);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const updateReadBy = async (req, res) => {
    const chatId = req.params.chatId;
    if(!chatId) return res.status(400).json({ message: "Chat id is required" });

    try {
        const chat = await Chat.findById(chatId);
        if (chat.isGroupChat) {
            await Message.updateMany(
                { chat: chatId, readBy: { $nin: [req.user._id] }, sender: { $ne: req.user._id } },
                { $addToSet: { readBy: req.user._id } }
            );
            io.to(chatId).emit('readBy', { userId : req.user._id, chatId: chatId });
            return res.status(200).json("the messages updated successfully");
        }
   
        await Message.updateMany({ chat: chatId, readBy: { $size: 0 }, sender: { $ne: req.user._id } }, { $set: { readBy: [req.user._id] } });
        io.to(chatId).emit('readBy', { userId : req.user._id, chatId: chatId });
        return res.status(200).json("the messages updated successfully");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const chatHandlers = {
    sentMessage,
    fetchMessages,
    updateReadBy
};

export default chatHandlers;
