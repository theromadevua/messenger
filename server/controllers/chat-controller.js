import chatService from "../services/chat-service.js"


class ChatController {

    async joinChat(req, res, next){
        try {
            const {chat_id} = req.params
            const response = await chatService.joinChat(chat_id, req.user)
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }

    async getChatById(req, res, next){
        try {
            const {chat_id} = req.params
            const chat = await chatService.getChatById(chat_id, req.user)
            return res.json(chat)
        } catch (error) {
            next(error)
        }
    }

    async searchChatsAndUsers(req, res, next){
        try {
            const {query} = req.query
            const results = await chatService.searchChatsAndUsers(query,req.user)
            return res.json(results) 
        } catch (error) {
            next(error)
        }
    }


    async deleteChat(req, res, next) {
        try {
            const { chatId } = req.params;
            const deletedChat = await chatService.deleteChat({ user: req.user, chatId });
            return res.json(deletedChat);
        } catch (error) {
            next(error);
        }
    }

    async createChat(req, res, next) {
        try {
            const { name, link, type, otherUserId } = req.body;
            const chat = await chatService.createChat({ name, link, type, user: req.user, otherUserId: otherUserId || null });
            return res.json(chat);
        } catch (error) {
            next(error);
        }
    }

    async getUserChats(req, res, next) {
        try {
            const chats = await chatService.getUserChats(req.user);
            return res.json(chats);
        } catch (error) {
            next(error);
        }
    }

    async getChatHistory(req, res, next) {
        try {
            const { chat_id } = req.params;
            const { page, limit, skip} = req.body.params;
            const messages = await chatService.getChatHistory({ chat_id, page, limit, skip });
            return res.json(messages);
        } catch (error) {
            next(error);
        }
    }

    async setChatWallpaper(req, res, next){
        try {
            const {chat_id} = req.params
            const {isBlurred, blackout} = req.body
            const {wallpaper} = req.files || {}
            let resetWallpaper = false
            if(Object.keys(req.body).length === 0 && !req.files) resetWallpaper = true
            const chat = await chatService.setChatWallpaper({chatId: chat_id, user: req.user, wallpaper, isBlurred, blackout, resetWallpaper})
            return res.json(chat)
        } catch (error) {
            next(error)
        }
    }

    async getMessagesUntilTarget(req, res, next){
        try {
            const { chatId, page, limit, targetMessageId, skip } = req.body
            const messages = await chatService.getMessagesUntilTarget({chatId, targetMessageId, initialLimit: limit, initialPage: page, skip})
            return res.json(messages)
        } catch (error) {
            next(error);
        }
    }

    async editChat(req, res, next){
        try {
            const {chat_id} = req.params
            const {name, link, description} = req.body
            const {avatar} = req.files || {}
            const chat = await chatService.editChat({user: req.user, chat_id, name, link, description, avatar: avatar || null})
            return res.json(chat)
        } catch (error) {
            next(error)
        }
    }

    async leaveChat(req, res, next){
        try {
            const {chat_id} = req.params
            const response = await chatService.leaveChat(chat_id, req.user)
            return res.json(response)
        } catch (error) {
            next(error)
        }
    }

    async dismissAdmin(req, res, next){
        try {
            const {memberId} = req.params
            const member = await chatService.dismissAdmin({memberId, user: req.user})
            return res.json(member)
        } catch (error) {
            next(error)
        }
    }

    async assignAdmin(req, res, next){
        try {
            const {memberId} = req.params
            const member = await chatService.assignAdmin({memberId, user: req.user})
            return res.json(member)
        } catch (error) {
            next(error)
        }
    }

    async addUser(req, res, next){
        try {
            const {chat_id} = req.params
            const {anotherUserId} = req.body

            const member = await chatService.addUser({user: req.user, anotherUserId, chat_id})
            return res.json(member)
        } catch (error) {
            next(error)
        }
    }

}

export default new ChatController()