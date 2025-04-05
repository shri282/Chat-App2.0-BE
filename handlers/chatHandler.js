import ChatService from '../services/chat/ChatService.js';

const openChat = async(req, res) => {
    try {
        const chatService = new ChatService(req.user);
        const chat = await chatService.openChat(req.body.userId);
        return res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const fetchChats = async(req, res) => {
    try {
        const chatService = new ChatService(req.user);
        let chats = await chatService.fetchChats();
        return res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const createGroupChat = async(req, res) => {
    try {
        const chatService = new ChatService(req.user);
        const newGroupChat = await chatService.createGroupChat(req.body.groupName, req.body.groupMembers);
        return res.status(200).json(newGroupChat); 
    } catch(error) {    
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

const handleGroupOperation = (operation) => async (req, res) => {
    try {
        const chatService = new ChatService(req.user);
        const result = await chatService[operation](req.body);
        return res.status(200).json(result);
    } catch(error) {
        console.error(`Error in ${operation}:`, error);
        return res.status(500).json({ message: error.message });
    }
}

export const updateGroupChat = handleGroupOperation('updateGroupChat');
export const renameGroup = handleGroupOperation('renameGroup');
export const addMember = handleGroupOperation('addMember');
export const removeMember = handleGroupOperation('removeMember');

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