import express from 'express';
import authUser from '../middleware/authMiddleware.js';
import chatHandlers from '../handlers/messageHandler.js';

const messageRouter = express.Router();
const { sentMessage,  fetchMessages } = chatHandlers;

messageRouter.post('/sentMessage', authUser, sentMessage);
messageRouter.get('/:chatId', authUser, fetchMessages);

export default messageRouter;