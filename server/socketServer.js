import { Server } from 'socket.io';
import socketMiddleware from './middlewares/socket-middleware.js';
import ApiError from './exceptions/api-error.js';
import messageService from './services/message-service.js';
import chatService from './services/chat-service.js';
import UserStatusService from './services/userStatus-service.js';

const ALLOWED_ORIGINS = [
  process.env.API_URL,
  process.env.CLIENT_URL,
];

const handleError = (socket, error) => {
  console.error('Socket error:', error);
  socket.emit('error', {
    message: error instanceof ApiError ? error.message : 'An unexpected error occurred',
    status: error instanceof ApiError ? error.status : 500
  });
};


const messageHandlers = {
  async message(socket, io, data) {
    let message;

    switch(data.type) {
      case 'combined':
      case 'text':
        message = await messageService.createChatMessage({
          user: socket.user,
          text: data.text,
          chat_id: data.chat_id,
          reply_to_message: data.reply_to_message,
          chatType: data.chatType,
          media: data.media,
          type: data.type
        });
        break;
      case 'audio':
        message = await messageService.createAudioMessage({
          user_id: socket.user,
          chat_id: data.chat_id,
          audio: data.audio,
          reply_to_message: data.reply_to_message
        });
        break;
    }

    const fullMessage = await messageService.getChatMessageById(message._id);

    if (!fullMessage) throw ApiError.BadRequest("error when creating message");

    io.emit('message', fullMessage);
  },

  async editMessage(socket, io, data) {
    const message = await messageService.editChatMessage({
      user: socket.user,
      message_id: data.message_id,
      text: data.text,
      chat_id: data.chat_id,
      chatType: data.chatType
    });

    if (!message) throw ApiError.BadRequest("error when editing message");

    io.emit('editMessage', message);
  },

  async deleteMessage(socket, io, data) {
    const chat = await messageService.deleteChatMessage({
      user: socket.user,
      message_id: data.message_id,
      chat_id: data.chat_id,
      chatType: data.chatType
    });

    if (!chat) throw ApiError.BadRequest("error when deleting message");
    io.emit('deleteMessage', data);
    io.emit('updateChatData', chat);
  },

  async deleteChat(socket, io, data) {
    const deletedChat = await chatService.deleteChat({
      chatId: data.chatId,
      type: data.type,
      user: socket.user
    });

    if (!deletedChat) throw ApiError.BadRequest("error when deleting chat");
    io.emit('deleteChat', data.chatId);
  }
};



function setupSocket(server) {

  const userSubscriptions = new Map();

  const io = new Server(server, {
    maxHttpBufferSize: 10 * 3024 * 3024,
    cors: {
      origin: ALLOWED_ORIGINS,
      methods: ["GET", "POST"]
    }
  });

  io.use(socketMiddleware);

  function subscribeToUser(userId, socketId) {
    if (!userSubscriptions.has(userId.toString())) {
        userSubscriptions.set(userId.toString(), new Set());
    }
    userSubscriptions.get(userId.toString()).add(socketId.toString());
  }

  function unsubscribeFromUser(userId, socketId) {
    if (userSubscriptions.has(userId.toString())) {
        userSubscriptions.get(userId.toString()).delete(socketId.toString());
        if (userSubscriptions.get(userId.toString()).size === 0) {
            userSubscriptions.delete(userId.toString());
        }
    }
  }

  function notifySubscribers(userId, status) {
    if (userSubscriptions.has(userId.toString())) {
        userSubscriptions.get(userId.toString()).forEach(socketId => {
            io.to(socketId).emit('userStatus', { userId: userId.toString(), status: status });
        });
    }
  }

  io.on('connection', (socket) => {
    console.log('A user connected');

    if (!socket.user) {
      socket.disconnect();
      return;
    }

    const userId = socket.user._id;

    UserStatusService.setUserOnline(userId, socket.id);
    notifySubscribers(userId, true);

    socket.on('subscribeToUsers', (userIds) => {
      userIds.forEach(_id => subscribeToUser(_id, socket.id));
    });

    Object.entries(messageHandlers).forEach(([event, handler]) => {
      socket.on(event, async (data) => {
        try {
          await handler(socket, io, data);
        } catch (error) {
          handleError(socket, error);
        }
      });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        UserStatusService.setUserOffline(userId);
        notifySubscribers(userId, false);

        userSubscriptions.forEach((sockets, id) => {
          unsubscribeFromUser(id, socket.id);
        });
    });
  });

  return io;
}

export default setupSocket;