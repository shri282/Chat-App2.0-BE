import express from 'express';
import authUser from '../middleware/authMiddleware.js';
import chatHandlers from '../handlers/messageHandler.js';

const messageRouter = express.Router();
const { sentMessage,  fetchMessages, updateReadBy } = chatHandlers;

messageRouter.get('/:chatId', authUser, fetchMessages);
messageRouter.post('/sentMessage', authUser, sentMessage);
messageRouter.post('/:chatId/readBy', authUser, updateReadBy);

export default messageRouter;