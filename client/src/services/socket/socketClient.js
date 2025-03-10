import io from 'socket.io-client';
import ChatStore from '../../store/chat/ChatStore';
import AuthStore from '../../store/AuthStore';
import { BASE_URL } from '../api';
import UserStore from '../../store/UserStore';

let socket;
let isConnecting = false;


export const connectSocket = async (navigate) => {
  if (socket || isConnecting) return;

  isConnecting = true;

  try {
    socket = io(BASE_URL, {
      auth: { token: await AuthStore.refreshTokens() }
    });

    socket.on('userStatus', ({ userId, status }) => {
      UserStore.setUserStatus(userId, status);
    });

    socket.on('connect', () => {
      console.log('Connected to server');
      isConnecting = false;
    });

    socket.on('message', (data) => {
      ChatStore.messageManager.updateMessages({type: 'add_message', data});
    });

    socket.on('editMessage', (data) => {
      ChatStore.messageManager.updateMessages({type: 'edit_message', data});
    });

    socket.on('deleteMessage', (data) => {
      ChatStore.messageManager.updateMessages({type: 'delete_message', data});
    });

    socket.on('updateChatData', (chat) => {
      ChatStore.chatManager.updateChatData(chat)
    })

    socket.on('deleteChat', (chatId) => {
      navigate('/');
      ChatStore.chatManager.updateChats({type: 'delete_chat', chatId});
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      socket = null;
      isConnecting = false;
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      isConnecting = false;
    });

    socket.on('userStatus', ({ userId, status }) => {
      UserStore.setUserStatus(userId, status);
  });

  } catch (error) {
    console.error('Error connecting socket:', error);
    isConnecting = false;
  }
};

export const subscribeToUser = (userIdsForSubscription) => {
  if(socket) socket.emit('subscribeToUsers', userIdsForSubscription);
  else {
    console.error('Socket not connected. Cannot delete chat.');
  }
}

export const deleteChat = (chatId, type) => {
  if (socket) {
    socket.emit('deleteChat', {chatId, type});
  } else {
    console.error('Socket not connected. Cannot delete chat.');
  }
};


export const editMessage = (message) => {
  if (socket) {
    socket.emit('editMessage', message);
  } else {
    console.error('Socket not connected. Cannot delete chat.');
  }
};


export const sendMessage = (message) => {
  if (socket) {
    socket.emit('message', message);
  } else {
    console.error('Socket not connected. Cannot send message.');
  }
};


export const deleteMessage = (message) => {
  if (socket) {
    socket.emit('deleteMessage', message);
  } else {
    console.error('Socket not connected. Cannot delete message.');
  }
};


export const disconnectSocket = () => {
  if (!socket) return;
  socket.off('connect');
  socket.off('message');
  socket.off('deleteMessage');
  socket.disconnect();
  socket = null;
};