import Chat from "../../models/chat.js";
import User from "../../models/user.js";
import BaseChatService from "./BaseChatService.js";

class ChatService extends BaseChatService {

    constructor(user) {
        super(user)
    }

    async openChat(recipientId) {
        let existingChat = await Chat.findOne({ 
            isGroupChat: false,
            users: { $all: [recipientId, this.user._id] }
        })
        .populate('users', '-password')
        .populate('latestMessage');
     
        existingChat = await User.populate(existingChat, { 
            path: "latestMessage.sender", 
            select: "-password" 
        });
     
        if (existingChat) {
            return existingChat;
        }
    
        const recipient = await User.findById(recipientId).select('name -_id');     
        const createdChat = await Chat.create({ 
            isGroupChat: false,
            chatName: recipient.name,
            users: [recipientId, this.user._id] 
        });    
        const populatedChat = await Chat.findById(createdChat._id).populate('users', '-password');
        
        return populatedChat;     
    }

    async fetchChats() {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: this.user._id } } })
        .populate('users', '-password')
        .populate('latestMessage')
        .populate('groupAdmin', '-password')
        .sort({ updatedAt: -1 });
    
        chats = await User.populate(chats, { path: "latestMessage.sender", select: "-password" });
        return chats;
    }

    async createGroupChat(groupName, groupMembers) {
        const newGroupChat = await Chat.create({
            isGroupChat: true,
            chatName: groupName,
            users: groupMembers,
            groupAdmin: this.user._id
        });

        const groupChat = await Chat.findById(newGroupChat._id)
        .populate('users', '-password')
        .populate('groupAdmin', '-password');

        return groupChat;
    }

    async updateGroupChat({ groupId, groupName, groupMembers }) {
        return this._updateGroupAndReturn(groupId, {
            chatName: groupName,
            users: groupMembers
        });
    }

    async renameGroup({ groupId, newGroupName }) {
        return this._updateGroupAndReturn(groupId, {
            chatName: newGroupName
        });
    }

    async addMember({ groupId, newMember }) {
        return this._updateGroupAndReturn(groupId, {
            $push: { users: newMember }
        });
    }

    async removeMember({ groupId, memberToRemove }) {
        return this._updateGroupAndReturn(groupId, {
            $pull: { users: memberToRemove }
        });
    }
    
}

export default ChatService;