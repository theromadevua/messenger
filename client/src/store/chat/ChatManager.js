import api from "../../services/api";
import { deleteChat, subscribeToUser } from "../../services/socket/socketClient";
import UserStore from "../UserStore";
import AuthStore from "./../AuthStore";

class ChatManager {
    constructor(rootStore) {
        this.rootStore = rootStore;
    }

    async createPublicChat({ link, name }) {
        try {
            const response = await api.post('/createChat', { 
                name, 
                link, 
                type: 'public' 
            });
            this.rootStore.state.chats.push(response.data);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to create public chat');
        }
    }

    async createPrivateChat(text) {
        try {
            const res = await api.post('/createChat', {
                type: 'private',
                otherUserId: this.rootStore.state.anotherUserData._id,
                name: 'chat'
            });
            
            this.rootStore.state.chats.push(res.data);
            this.rootStore.setState('currentChat', res.data);
            this.rootStore.setState('isMember', true);
            
            await this.rootStore.messageManager.createChatMessage({
                text,
                chatType: 'private',
                id: res.data._id
            });
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to create private chat');
        }
    }

    async searchChatsAndUsers(query) {
        try {
            const data = await api.get(`/searchChatsAndUsers`, {
                params: { query }
            });
            this.rootStore.setState('searchedData', data.data);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to search chats and users');
        }
    }

    async resetSearchedData() {
        this.rootStore.setState('searchedData', []);
    }

    async editChat(data, chat_id) {
        try {
            const response = await api.post(`editChat/${chat_id}`, data);
            const updatedData = response.data;
            
            this.updateChat(chat_id, chat => ({
                ...chat,
                name: updatedData.name,
                link: updatedData.link,
                description: updatedData.description,
                avatar: updatedData.avatar
            }));
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to edit chat');
        }
    }

    async setChatWallpaper(data) {
        try {
            const response = await api.post(
                `/setChatWallpaper/${this.rootStore.state.currentChat._id}`, 
                data
            );
            this.updateChat(this.rootStore.state.currentChat._id, chat => ({
                ...chat,
                chatWallpaper: response.data.chatWallpaper || null
            }));
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to set chat wallpaper');
        }
    }

    async deleteChat(chat_id) {
        try {
            deleteChat(chat_id, this.rootStore.state.currentChat.type);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to delete chat');
        }
    }

    async leaveChat(id) {
        try {
            const response = await api.delete(`leaveChat/${id}`);
            if (!response.data) return;
            
            this.rootStore.setState('chats', 
                this.rootStore.state.chats.filter(chat => chat._id !== id)
            );
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to leave chat');
        }
    }

    async joinChat(chat_id) {
        try {
            const response = await api.post(`joinChat/${chat_id}`);
            if (!response.data) return;

            const { chat } = response.data;
            this.rootStore.state.chats.push(chat);
            await this.setCurrentChat(chat._id);
            await this.rootStore.messageManager.updateChatHistory(chat._id);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to join chat');
        }
    }

    async setCurrentChat(id) {
        try {
            this.rootStore.setState('isMember', false);
            let chatFound = false;

            for (const chat of this.rootStore.state.chats) {
                if (chat._id === id) {
                    chatFound = true;
                    await this.processExistingChat(chat);
                    break;
                }
            }

            if (!chatFound && id) {
                await this.processNewChat(id);
            }
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to set current chat');
        }
    }

    async getUserPublicChats() {
        try {
            if (this.rootStore.state.isLoadingChats) return;
            this.rootStore.setState('isLoadingChats', true);
            
            const response = await api.get('/getUserChats');
            this.rootStore.setState('chats', response.data.chats);

            if(response.data.chats.length > 0){
                for (const chat of response.data.chats) {
                    if(chat.type === 'private'){
                        UserStore.setUsers([{_id: chat.with_user, name: chat.name, avatar: chat.avatar, online: chat.online}]);
                    }else{
                        for (const member of chat.members) {
                            UserStore.setUsers([member.user]);
                        }
                    }
                }
            }

            subscribeToUser(response.data.userIdsForSubscription);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to get public chats');
        } finally {
            this.rootStore.setState('isLoadingChats', false);
        }
    }

    updateChat(chatId, updater) {
        this.rootStore.state.chats = this.rootStore.state.chats.map(chat => 
            chat._id === chatId ? updater(chat) : chat
        );
        this.setCurrentChat(chatId);
    }

    async getUser(id) {
        try {
            const response = await api.get(`/getUser/${id}`);
            const userData = response.data.user;
            subscribeToUser(response.data.userIdsForSubscription);
            UserStore.setUsers([userData]);
            
            if (this.rootStore.currentChat && this.rootStore.currentChat.with_user !== userData._id) {
                this.rootStore.setState('currentChat', null);
            }
            
            this.rootStore.setState('anotherUserData', userData);
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to get user');
        }
    }

    updateChatMessages(chatId, messageUpdater) {
        this.rootStore.state.chats = this.rootStore.state.chats.map(chat => 
            chat._id === chatId
                ? { ...chat, messages: chat.messages.map(messageUpdater) }
                : chat
        );
        this.setCurrentChat(chatId);
    }

    async updateChatData(chatData) {
        try {
            const updater = (chat) => ({
                ...chat, 
                last_message: chatData.last_message
            });

            this.rootStore.state.chats = this.rootStore.state.chats.map(chat => 
                chat._id === chatData._id ? updater(chat) : chat
            );
        } catch (error) {
            this.rootStore.handleError(error, 'Error when updating chat data');
        }
    }

    async updateChats(data) {
        try {
            this.rootStore.state.chats = this.rootStore.state.chats
                .filter(chat => chat._id !== data.chatId);
            await this.resetChat();
        } catch (error) {
            this.rootStore.handleError(error, 'Failed to update chats');
        }
    }

    async processExistingChat(chat) {
        this.rootStore.setState('currentChat', chat);
        this.rootStore.setState('isMember', true);
        this.rootStore.setState('selectedMessage', null);
        this.rootStore.setState('replyToMessageId', null);

        await UserStore.setUsers( chat.members.map(m => m.user));
        this.updateUserRoles(chat);
        if(this.rootStore.state.currentChat?.messages.length == 0) this.loadChatMessages(chat._id);
    }

    async processNewChat(id) {
        const response = await api.get(`/getChatById/${id}`);
        const chat = response.data.chat;
        if (!chat) return;

        const isMember = this.checkMembership(chat);
        this.rootStore.setState('isMember', isMember);
        
        if (!isMember) {
            this.rootStore.setState('currentChat', chat);
            this.rootStore.setState('selectedMessage', null);
            this.rootStore.setState('replyToMessageId', null);
            await this.loadChatMessages(id);
        }
    }

    updateUserRoles(chat) {
        if(chat.type === 'public'){
            this.rootStore.setState('anotherUserData', null);
        }
        chat.members.forEach(member => {
            if (AuthStore.user._id === member.user._id) {
                this.rootStore.setState('isAdmin', member.role === 'ADMIN');
                this.rootStore.setState('isOwner', member.role === 'OWNER');
                if (member.role === 'MEMBER') {
                    this.rootStore.setState('isAdmin', false);
                    this.rootStore.setState('isOwner', false);
                }
            }
        });
    }

    checkMembership(chat) {
        return chat.members.some(member => 
            AuthStore.user._id === member.user._id && 
            ['ADMIN', 'OWNER', 'MEMBER'].includes(member.role)
        );
    }

    async loadChatMessages(chatId) {
        if (this.rootStore.state.isLoadingHistory) return;
        this.rootStore.setState('isLoadingHistory', true);   

        if(!this.rootStore.pagination.skipPages[chatId]) this.rootStore.pagination.skipPages[chatId] = 0;
        if(!this.rootStore.pagination.chatPages[chatId]) this.rootStore.pagination.chatPages[chatId] = 1;

        const response = await api.post(`/getChatHistory/${chatId}`, {
            params: {
                page: this.rootStore.pagination.chatPages[chatId],
                limit: this.rootStore.pagination.limit,
                skip: this.rootStore.pagination.skipPages[chatId]
            }
        });

        if(!response.data || response.data.length === 0) {
            this.rootStore.setState('isLoadingHistory', false) 
            return
        }

        this.rootStore.state.currentChat.messages = [...this.rootStore.state.currentChat.messages, ...response.data]
        
        this.rootStore.pagination.chatPages[chatId] += 1;
        this.rootStore.setState('isLoadingHistory', false);
    }

    async resetChat() {
        this.rootStore.setState('currentChat', null);
        this.rootStore.setState('anotherUserData', null);
        this.rootStore.setState('isMember', null);
    }
}

export default ChatManager;