import express from 'express';
import chatHandlers from '../handlers/chatHandler.js';
import authUser from '../middleware/authMiddleware.js';

const chatRouter = express.Router();
const { openChat, fetchChats, createGroupChat, renameGroup, addMember, removeMember, updateGroupChat } = chatHandlers;

chatRouter.post('/openChat', authUser, openChat);
chatRouter.get('/fetchChats', authUser, fetchChats);
chatRouter.post('/createGroupChat', authUser, createGroupChat);
chatRouter.post('/updateGroupChat', authUser, updateGroupChat);
chatRouter.post('/renameGroup', authUser, renameGroup); 
chatRouter.post('/addMembers', authUser, addMember);
chatRouter.post('/removeMembers', authUser, removeMember);
// chatRouter.post('/leaveGroup', authUser, leaveGroup);
// chatRouter.post('/deleteChat', authUser, deleteChat);

export default chatRouter;