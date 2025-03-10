// stores/chat/MessageManager.js
import { makeAutoObservable } from "mobx";
import { deleteMessage, editMessage, sendMessage } from "../../services/socket/socketClient";
import api from "../../services/api";

class MessageManager {
    constructor(rootStore) {
        makeAutoObservable(this)
        this.rootStore = rootStore;
    }

    async createChatMessage({ text, id, chatType = 'public', files }) {
        try {
            const messageData = {
                chat_id: id,
                text,
                chatType,
                type: files ? 'combined' : 'text',
                reply_to_message: this.rootStore.state.replyToMessageId,
                media: files
            };
            
            sendMessage(messageData);
            this.rootStore.setState('replyToMessageId', null);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to send message');
        }
    }

    async createAudioMessage({ audioBlob, id }) {
        try {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Audio = reader.result;
                const message = {
                    audio: base64Audio,
                    chat_id: id,
                    type: 'audio'
                };
                sendMessage(message);
            };
            reader.readAsDataURL(audioBlob);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to create audio message');
        }
    }

    async editChatMessage({ text, id, message_id, chatType = 'public' }) {
        try {
            editMessage({
                chat_id: id,
                text,
                chatType,
                message_id
            });
            this.rootStore.setState('replyToMessageId', null);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to edit message');
        }
    }

    async deleteChatMessage() {
        try {
            deleteMessage({
                chat_id: this.rootStore.state.selectedMessage.chat,
                message_id: this.rootStore.state.selectedMessage._id,
                chatType: 'public'
            });
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to delete message');
        }
    }

    async updateChatHistory(id) {
        if (this.rootStore.state.isLoadingHistory) return;
        this.rootStore.setState('isLoadingHistory', true);
        
        try {
            if (!this.rootStore.pagination.chatPages[id]) {
                this.rootStore.pagination.chatPages[id] = 2;
            }
            if (!this.rootStore.pagination.skipPages[id]) {
                this.rootStore.pagination.skipPages[id] = 0;
            }

            const messages = await api.post(`/getChatHistory/${id}`, {
                params: {
                    page: this.rootStore.pagination.chatPages[id],
                    limit: this.rootStore.pagination.limit,
                    skip: this.rootStore.pagination.skipPages[id]
                }
            });

            this.rootStore.chatManager.updateChat(id, chat => ({
                ...chat,
                messages: [...chat.messages, ...messages.data]
            }));

            this.rootStore.pagination.chatPages[id] += 1;
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to update chat history');
        } finally {
            this.rootStore.setState('isLoadingHistory', false);
        }
    }

    async getMessagesUntilTarget({ chatId, messageId }) {
        try {
            const response = await api.post('/getMessagesUntilTarget', {
                chatId,
                limit: this.rootStore.pagination.limit,
                page: this.rootStore.pagination.chatPages[chatId] || 2,
                targetMessageId: messageId,
                skip: this.rootStore.pagination.skipPages[chatId]
            });

            if (!response.data.messages) return;

            this.rootStore.chatManager.updateChat(chatId, chat => ({
                ...chat,
                messages: [...chat.messages, ...response.data.messages]
            }));
            
            this.rootStore.pagination.chatPages[chatId] = response.data.newPage;
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to get messages');
        }
    }

    async setReplyToMessageId(value) {
        this.rootStore.setState('replyToMessageId', 
            value ? this.rootStore.state.selectedMessage._id : null
        );
    }

    setMessageMedia(media) {
        if (!media) {
            this.rootStore.setState('messageMedia', []); 
            return;
        }
        const newMedia = Array.isArray(media) 
            ? media 
            : [...this.rootStore.state.messageMedia, media];
        this.rootStore.setState('messageMedia', newMedia);
    }

    clearMessageMedia() {
        this.rootStore.setState('messageMedia', []);
    }

    async updateMessages({ type, data }) {
        try {
            switch (type) {
                case 'add_message':
                    this.handleAddMessage(data);
                    break;

                case 'edit_message':
                    this.handleEditMessage(data);
                    break;

                case 'delete_message':
                    await this.handleDeleteMessage(data);
                    break;
            }
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to update messages');
        }
    }

    handleAddMessage(data) {
        this.rootStore.chatManager.updateChat(data.chat, chat => ({
            ...chat,
            messages: [data, ...(chat.messages || [])],
            last_message: data
        }));
        this.rootStore.pagination.skipPages[data.chat] = 
            (this.rootStore.pagination.skipPages[data.chat] || 0) + 1;
    }

    handleEditMessage(data) {
        this.rootStore.chatManager.updateChatMessages(data.chat, msg => 
            msg._id === data._id ? { ...msg, text: data.text } : msg
        );
    }

    async handleDeleteMessage(data) {
        const chat = this.rootStore.state.chats.find(c => c._id === data.chat_id);
        if (chat) {
            this.rootStore.chatManager.updateChat(data.chat_id, chat => ({
                ...chat,
                messages: chat.messages.filter(msg => msg._id !== data.message_id)
            }));
            
            this.rootStore.pagination.skipPages[chat._id] = Math.max(
                (this.rootStore.pagination.skipPages[chat._id] || 1) - 1,
                0
            );

            if (chat.messages.length < this.rootStore.pagination.limit) {
                await this.updateChatHistory(chat._id);
            }
        }
    }
}

export default MessageManager;