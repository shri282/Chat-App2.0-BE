import express from 'express';
import chatHandlers from '../handlers/chatHandler.js';
import authUser from '../middleware/authMiddleware.js';
import { validateOpenChat, validateCreateGroupChat, validateRenameGroup, validateUpdateGroupChat, validateAddMember, validateRemoveMember } from '../requests/chatRequest.js';

const chatRouter = express.Router();
const { openChat, fetchChats, createGroupChat, renameGroup, addMember, removeMember, updateGroupChat } = chatHandlers;

chatRouter.post('/openChat', [authUser, validateOpenChat], openChat);
chatRouter.post('/createGroupChat', [authUser, validateCreateGroupChat], createGroupChat);
chatRouter.post('/updateGroupChat', [authUser, validateUpdateGroupChat], updateGroupChat);
chatRouter.post('/renameGroup', [authUser, validateRenameGroup], renameGroup); 
chatRouter.post('/addMembers', [authUser, validateAddMember], addMember);
chatRouter.post('/removeMembers', [authUser, validateRemoveMember], removeMember);
chatRouter.get('/fetchChats', authUser, fetchChats);
// chatRouter.post('/leaveGroup', authUser, leaveGroup);
// chatRouter.post('/deleteChat', authUser, deleteChat);

export default chatRouter;