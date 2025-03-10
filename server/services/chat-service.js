import mongoose from "mongoose"
import ApiError from "../exceptions/api-error.js"
import chatModel from "../models/chat-model.js"
import memberModel from "../models/member-model.js"
import messageModel from "../models/message-model.js"
import userModel from "../models/user-model.js"
import mediaService from "./media-service.js"
import TokenService from "./token-service.js"
import User from "../models/user-model.js"
import mediaModel from "../models/media-model.js"
import UserStatusService from "./userStatus-service.js"


class chatService {

    async dismissAdmin({memberId, user}){
        const otherMember = await memberModel.findOne({_id: memberId})
        const member = await memberModel.findOne({user: user._id, chat: otherMember.chat})
        if((member.role == 'OWNER') && otherMember.role == 'ADMIN'){
            otherMember.role = 'MEMBER'
        }
        otherMember.save()
        return otherMember
    }

    async assignAdmin({memberId, user}){
        const otherMember = await memberModel.findOne({_id: memberId})
        const member = await memberModel.findOne({user: user._id, chat: otherMember.chat})
        if(member.role == 'OWNER'){
            otherMember.role = 'ADMIN'
        }
        otherMember.save()
        return otherMember
    }

    async leaveChat(chatId, user){
        const member = await memberModel.deleteOne({chat: chatId, user: user._id})
        if(member) return true
        if(!member) throw ApiError.BadRequest('Chat not found')
    }  

    async setChatWallpaper({chatId, user, wallpaper, isBlurred, blackout, resetWallpaper}) {
        const chat = await chatModel.findOne({ _id: chatId }).populate(['members']).populate({path: 'chatWallpaper', populate: {path: 'media'}});
        if (!chat) {
            throw ApiError.BadRequest('Chat not found');
        }
        if(!chat.members.some(member => member.user.equals(user._id))){
            throw ApiError.BadRequest('You are not a member of this chat');
        }
        if(resetWallpaper){
            chat.chatWallpaper.media = null
            chat.chatWallpaper.data.isBlurred = false
            chat.chatWallpaper.data.blackout = 0
            chat.save()
            return {chatWallpaper: chat.chatWallpaper}
        }
        if(isBlurred){
            chat.chatWallpaper.data.isBlurred = isBlurred
        }
        if(blackout){
            chat.chatWallpaper.data.blackout = blackout
        }
        if(wallpaper){
            const uploadFile = await mediaService.saveFile(wallpaper, 'wallpapers')
            if(!uploadFile){
                throw ApiError.BadRequest('file was not uploaded')
            }
            const wallpaperMedia = new mediaModel({
                url: uploadFile.url,
                width: uploadFile.width,
                height: uploadFile.height,
                aspectRatio: uploadFile.aspectRatio,
                type: 'image', 
            })
            wallpaperMedia.save()
            chat.chatWallpaper.media = wallpaperMedia
        }
        chat.save()
        return {chatWallpaper: chat.chatWallpaper}
    }
    
    async getChatById(chatId, currentUser) {
        const chat = await chatModel.findById(chatId).populate([
            {
                path: 'members',
                populate: {
                    path: 'user',
                    populate: {
                        path: 'avatar'
                    }
                }
            },
            {
                path: 'avatar',
            },
            {
                path: 'last_message',
                populate: [{
                    path: 'from_user',
                    select: 'name'
                }, {
                    path: 'media',
                }]
            }
        ]).lean();
    
        if (!chat) {
            throw ApiError.BadRequest('Chat not found');
        }
        
        

        if (chat.type === 'private') {
            const withUser = chat.members.find(
                member => member.user._id.toString() !== currentUser._id.toString()
            );
            
            chat.with_user = withUser ? withUser.user._id : null;
            chat.avatar = withUser ? withUser.user.avatar : null;
            chat.name = withUser ? withUser.user.name : null;
        }

        chat.members = chat.members.map(member => ({
            ...member,
            user: {
                ...member.user,
                online: UserStatusService.isUserOnline(member.user._id)
            }
        }));


        let messages = await this.getChatHistory({chat_id: chatId, page: 1, limit: 10, skip: 0})
        chat.messages = messages ? messages : []

        return { chat, userIdsForSubscription: chat.members.map(m => m.user._id.toString()) };
    }

    async searchChatsAndUsers(query, user){
        const users = await User.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { username: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: user._id }
        }).select('username name _id avatar').populate('avatar');
        const publicChats = await chatModel.find({
            $or: [
              { name: { $regex: query, $options: 'i' } },
              { link: { $regex: query, $options: 'i' } }
            ],
            type: 'public'
        }).select('link name _id avatar type').populate([{
            path: 'last_message',
            populate: {
                path: 'media'
            }
        }, {
            path: 'avatar'
        }]);



        const members = await memberModel.find({ user: user._id }).select('chat').exec();
        const chatIds = members.map(member => member.chat);
        
        const otherMembers = await memberModel.find({
            chat: { $in: chatIds },
            user: { $ne: user._id }
        }).populate({
            path: 'user',
            select: 'name avatar username'
        }).exec();
       


        const filteredChatIds = otherMembers
        .filter(member => {
            const isNameMatch = member.user.name.includes(query);
            const isUserInUsers = users.some(user => user._id.equals(member.user._id));
            return isNameMatch && !isUserInUsers;
        })
        .map(member => member.chat);


        const privateChats = await chatModel.find({ _id: { $in: filteredChatIds }, type: 'private' })
            .select('link name _id avatar type')
            .exec();
        
        privateChats.forEach((chat) => {
            otherMembers.forEach((member) => {    
                if(chat._id.equals(member.chat)){
                    chat.link = member.user.username 
                    chat.avatar = member.user.avatar
                    chat.name = member.user.name
                }
            })
        })



        const results = [...users, ...privateChats, ...publicChats]
        return results
    }

    async deleteChat({user, chatId, type}){
        const member = await memberModel.findOne({ chat: chatId, user: user._id });

        if (!member) {
            throw ApiError.BadRequest('User is not member')
        }

        if (member.role !== 'OWNER' && type !== 'private') {
            throw ApiError.BadRequest('User is not owner')
        }   

        const chat = await chatModel.findByIdAndDelete(chatId)
        
        if(!chat){
            throw ApiError.BadRequest('Chat with such id doesnt exist')
        }

        return chat
    }

    async createChat({ name = 'chat', link, type, user, otherUserId }) {
        const memberIds = await memberModel
            .find({ user: { $in: [user._id, otherUserId] } })
            .distinct('_id');
    
        let existChat = null;
        if (type === 'public') {
            existChat = await chatModel.findOne({ link });
        } else if (type === 'private') {
            existChat = await chatModel.findOne({
                members: { $all: memberIds },
                type: 'private',
            });
        }
    
        if (existChat) {
            throw ApiError.BadRequest('Chat with such link already exists');
        }
    
        const chat = await chatModel.create({
            name,
            link: link || null,
            type,
            isPublic: type !== 'private',
        });
    
        const ownerMember = await memberModel.create({
            user: user,
            role: "OWNER",
            can_ban_users: true,
            can_assign_admins: true,
            chat: chat._id,
        });
    
        if (type === 'public') {
            const newMessage = await messageModel.create({
                chat: chat._id,
                type: 'system',
                metadata: {
                    action: 'chat_created',
                    data: {
                        owner: {
                            username: user.username,
                            _id: user._id,
                        },
                    },
                },
            });
            chat.last_message = newMessage; 
        }
    
        let otherMember = null;
    
        var otherUser;
        if (type === 'private') {
            otherUser = await userModel.findById(otherUserId);
            if (!otherUser) {
                throw ApiError.BadRequest('Other user not found');
            }
    
            otherMember = await memberModel.create({
                user: otherUserId,
                role: "MEMBER",
                chat: chat._id,
            });

            const avatar = await mediaModel.findById(otherUser.avatar)
    
            chat.avatar = avatar;
            chat.name = otherUser.name;
        }

        ownerMember.user = user

        chat.members = [ownerMember, ...(otherMember ? [otherMember] : [])];
        await chat.save();
    

        chat.members = await memberModel
            .find({ _id: { $in: chat.members.map(member => member._id) } })
            .select('-__v')
            .populate({path: 'user'}) 
    
   
        if (chat.type === 'private') {
            chat.with_user = otherUser._id
        }

        return chat;
    }

    async getUserChats(user) {
        const memberIds = await memberModel.find({ user: user._id }).distinct('_id');
        
        let chats = await chatModel.find({
            members: { $in: memberIds }
        }).populate([
            {
                path: 'members',
                populate: [{
                    path: 'user',
                    select: '_id username name avatar',
                    populate: {
                        path: 'avatar'
                    }
                }]
            },
            {
                path: 'avatar'
            },
            {
                path: 'last_message',
                populate: [{
                    path: 'from_user',
                    select: 'name'
                }, {
                    path: 'media',
                    select: 'url'
                }]
            }, {
                path: 'chatWallpaper',
                populate: {
                    path: 'media'
                }
            }
        ]).lean();
    
        const userIdsForSubscription = []

        chats = chats.map(chat => {
            if (chat.type === 'private') {
                const withUser = chat.members.find(member => member.user._id.toString() !== user._id.toString());
                const status = UserStatusService.isUserOnline(withUser.user._id)
                chat.with_user = withUser ? withUser.user._id : null;
                chat.avatar = withUser ? withUser.user.avatar : null;
                chat.name = withUser ? withUser.user.name : null;
                chat.online = status
                userIdsForSubscription.push(withUser.user._id)
            }
            if (chat.type === 'public') {
                for (const member of chat.members) {
                    if (member.user._id.toString() !== user._id.toString()) {
                        const status = UserStatusService.isUserOnline(member.user._id.toString())
                        member.user.online = status
                        userIdsForSubscription.push(member.user._id)
                    }
                }
            }
            return chat;
        });

        return {chats, userIdsForSubscription};
    
    }

    async getChatHistory({ chat_id, page, limit, skip = 0 }) {
        console.log(limit)
        const messages = await messageModel.find({ chat: chat_id })
            .sort({ createdAt: -1 })
            .skip(((page - 1) * limit) + parseInt(skip))
            .limit(parseInt(limit))
            .populate([{
                path: 'from_user',
                select: 'username name avatar _id',
                populate: {
                    path: 'avatar'
                }
            },
            {path: 'media'},
            {
                path: 'reply_to_message',
                select: 'text _id',
                populate: {
                    path: 'from_user',
                    select: 'name username _id'
                }
            }]);

        const newMessages = await Promise.all(messages.map(async (message) => {
            if (message.from_user) {
                const member = await memberModel.findOne({ chat: message.chat, user: message.from_user._id });
                message.from_member = member;
            }
            return message;
        }));

        return newMessages;
    }


    async getMessagesUntilTarget({chatId, targetMessageId, initialLimit, initialPage, skip = 0 }) {
        let limit = initialLimit;
        let page = initialPage;
        let targetFound = false;
        let allMessages = [];
      
        while (!targetFound) {
          const messages = await messageModel.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(((page - 1) * limit) + skip)
            .limit(parseInt(limit))
            .populate([{
                path: 'from_user',
                select: 'username name avatar'
            }, {
                path: 'media'
            },
            {
                path: 'reply_to_message',
                select: 'text _id',
                populate: {
                    path: 'from_user',
                    select: 'name username _id'
                }
            }]);

            if(messages.length == 0){
                break;
            }
            allMessages = [...messages, ...allMessages];
      
            if (messages.some(msg => msg._id.toString() === targetMessageId)) {
                targetFound = true;
                page++;
            } else {
                page++;
            }
      
            if (messages.length < limit) {
                break;
            }
        }

        return {
          messages: allMessages,
          newPage: page
        };
      }


    async editChat({user, name, link, description, avatar, chat_id}){

        const chat = await chatModel.findOne({_id: chat_id}).populate('members')
        
        if(!chat){
            throw ApiError.BadRequest('chat does not exist')
        }

        let canChange = false
        for (let member of chat.members){
            if (member.user._id.equals(user._id) && (member.role == 'OWNER' || member.role == 'ADMIN') && chat.type == 'public'){
                canChange = true
            }
        }
        
        if(canChange){

            if(name.length > 0) chat.name = name
            if(link.length > 0) chat.link = link
            chat.description = description

            if(avatar){
                const uploadFile = await mediaService.saveFile(avatar, 'avatars')
                if(!uploadFile){
                    throw ApiError.BadRequest('file was not uploaded')
                }
                const media = new mediaModel({
                    url: uploadFile.url,
                    width: uploadFile.width,
                    height: uploadFile.height,
                    aspectRatio: uploadFile.aspectRatio
                })
                media.save()
                chat.avatar = media
            }
            
            chat.save()
            return chat
        }else{
            throw ApiError.BadRequest('you dont have rights to edit chat params')
        }
    }

    async joinChat(chatId, user) {
        const chat = await chatModel.findOne({ _id: chatId}).populate([{path: 'members', populate: {path: 'user', select: '_id username name avatar'}}]);
    
        if (!chat) {
            throw ApiError.BadRequest('Chat not found');
        }
    
        const alreadyMember = this.isChatMember({ user_id: user._id, chat });
        if (alreadyMember) {
            throw ApiError.BadRequest('User is already a member of this chat');
        }
    
        const member = await memberModel.create({
            user: user._id,
            role: 'MEMBER',
            chat: chat._id
        });
    
        const newMessage = await messageModel.create({
            chat: chat._id,
            type: 'system',
            metadata: {
                action: 'user_join',
                data: {
                    new_member: {
                        username: user.username,
                        _id: user._id
                    }
                }
            }
        });
    
        chat.last_message = newMessage;
    
        member.user = user;

        chat.members.push(member);
    
        await chat.save();
        
        return { 
            newMessage, 
            member,
            chat 
        };
    }
    

    async addUser({anotherUserId, chat_id, user}){   
        const chat = await chatModel.findOne({_id: chat_id}).populate('members')

        if(!chat){
            throw ApiError.BadRequest('error when adding user')
        }

        const isMember = this.isChatMember({user_id: user._id, chat})

        if(!isMember){
            throw ApiError.BadRequest('user is not member')
        }

        const anotherUser = await userModel.findOne({_id: anotherUserId}).populate('avatar')
        if(!anotherUser){
            throw ApiError.BadRequest('user not found')
        }

        const alreadyMember = this.isChatMember({user_id: anotherUser._id, chat})
        if(alreadyMember){
            throw ApiError.BadRequest('user is already member in chat')
        }
      
        const member = await memberModel.create({user: anotherUser._id, chat: chat._id})

        const newMessage = await messageModel.create({chat: chat._id, type: 'system', metadata: {action: 'user_adding', data: {new_member: {username: anotherUser.username, _id: anotherUserId}, inviter: {username: user.username, _id: user._id}}}})
        
        chat.last_message = newMessage
    
        chat.members.push(member)
        chat.save()

        member.user = anotherUser
        member.user.avatar = anotherUser.avatar
        return {newMessage, member} 
    }

    isChatMember({user_id, chat}) {
        for (let member of chat.members) {
            if (member.user.equals(user_id)) {
                return member;
            }
        }
        return false;
    }

}


export default new chatService()