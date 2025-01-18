import Chat from '../models/chat.js';
import User from '../models/user.js';

const openChat = async(req, res) => {
    const { userId } = req.body;

    if(!userId) {
        return res.status(400).json({ message: "User not found" });
    }

    try {
        let chatData = await Chat.find({ 
           isGroupChat: false,
           $and: [
               { users: { $elemMatch: { $eq: userId } } },
               { users: { $elemMatch: { $eq: req.user._id } } }
           ]
        }).populate('users','-password').populate('latestMessage');
    
        chatData = await User.populate(chatData, { path: "latestMessage.sender", select: "-password" });
    
        if(chatData.length > 0) {
            return res.status(200).json(chatData[0]);
        } else {
            let receiverName = (await User.findById(userId).select('name -_id')).name;
            const newChatData = await Chat.create({ 
                isGroupChat: false,
                chatName: receiverName,
                users: [userId, req.user._id] 
            });
            console.log(receiverName);
            const fullChatData = await Chat.findById(newChatData._id).populate('users', '-password');
            return res.status(200).json(fullChatData);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}


const fetchChats = async(req, res) => {
    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
                               .populate('users', '-password')
                               .populate('latestMessage')
                               .populate('groupAdmin', '-password')
                               .sort({ updatedAt: -1 });
    
        chats = await User.populate(chats, { path: "latestMessage.sender", select: "-password" });
        return res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const createGroupChat = async(req, res) => {
    let { groupName, groupMembers } = req.body;
    if(!groupName || !groupMembers) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if(groupMembers.length < 2) {
        return res.status(400).json({ message: "Group must have at least 2 members" });
    }
    try {
       const newGroupChat = await Chat.create({
            isGroupChat: true,
            chatName: groupName,
            users: groupMembers,
            groupAdmin: req.user._id
        });

        const groupChat = await Chat.findById(newGroupChat._id)
            .populate('users', '-password')
            .populate('groupAdmin', '-password');

        return res.status(200).json(groupChat);
       
    } catch(error) {    
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}

const updateGroupChat = async(req, res) => {
    let { groupName, groupMembers, groupId } = req.body;
    console.log(groupId,groupName,groupMembers);
    if(!groupName || !groupMembers || !groupId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    if(groupMembers.length < 2) {
        return res.status(400).json({ message: "Group must have at least 2 members" });
    }
    try {
       const updatedGroupChat = await Chat.findByIdAndUpdate(groupId, {
        chatName: groupName,
        users: groupMembers,
       }, { new: true }).populate('users', '-password').populate('groupAdmin', '-password');
       console.log(updatedGroupChat);
       return res.status(200).json(updatedGroupChat);
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const renameGroup = async(req, res) => {
    const { groupId, newGroupName } = req.body;
    if(!groupId || !newGroupName) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedGroup = await Chat.findByIdAndUpdate(groupId, { chatName: newGroupName }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        if(!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        } else {
            return res.status(200).json(updatedGroup);
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const addMember = async(req, res) => {
    const { groupId, newMember } = req.body;
    if(!groupId || !newMember) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedGroup = await Chat.findByIdAndUpdate(groupId, { $push: { users: newMember } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        if(!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        } else {
            return res.status(200).json(updatedGroup);
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}

const removeMember = async(req, res) => {
    const { groupId, memberToRemove } = req.body;
    if(!groupId || !memberToRemove) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const updatedGroup = await Chat.findByIdAndUpdate(groupId, { $pull: { users: memberToRemove } }, { new: true })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate('latestMessage');

        if(!updatedGroup) {
            return res.status(404).json({ message: "Group not found" });
        } else {
            return res.status(200).json(updatedGroup);
        }
    } catch(error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }

}

const chatHandlers = {
    openChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    addMember,
    removeMember,
    updateGroupChat
}

export default chatHandlers;