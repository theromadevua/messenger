import ApiError from "../exceptions/api-error.js"
import memberModel from "../models/member-model.js"
import messageModel from "../models/message-model.js"
import publicChatModel from "../models/chat-model.js"
import chatModel from "../models/chat-model.js"
import mediaModel from "../models/media-model.js"
import mediaService from "./media-service.js"
import User from "../models/user-model.js"


class messageService {

    async deleteChatMessage({user, message_id, chat_id, chatType = 'public'}){
        const chat = await chatModel.findOne({_id: chat_id})

        const message = await messageModel.findOne({_id: message_id}).populate('media')
    
        const member = await memberModel.findOne({user: user._id}) 

        let canDelete =  false;

        if (!member) throw ApiError.BadRequest('cant find such member')
        if (!message) throw ApiError.BadRequest('cant find this message')

        if(member.role== 'OWNER' || member.role.toLowerCase() == 'ADMIN'){
            canDelete = true
        }

        if(message.from_user.equals(user._id)){
            canDelete = true
        }

        if(!canDelete){
            throw ApiError.BadRequest('user cant delete this message')
        }

        const previousMessage = await messageModel.findOne({
            chat: chat_id,
            _id: { $ne: message_id }
        }).sort({ createdAt: -1 }).populate([{path: 'media'}, {path: 'from_user'}]); 

        if (message.media.length) {
            await Promise.all(
              message.media.map(async (media) => {
                if (!media.url) return;
                try {
                  console.log(media);
                  await mediaService.deleteFile(media.url);
                } catch (err) {
                  console.error(`Error deleting file ${media.url}:`, err);
                }
              })
            );
          }
          

        const deleteMessage = await messageModel.deleteOne({_id: message_id})
        
        if (previousMessage) {
            chat.last_message = previousMessage; 
        } else {
            chat.last_message = null; 
        }
    
        chat.save()

        return chat
    }


    async editChatMessage({user, text, message_id, chat_id, chatType}){
        
        const message = await messageModel.findOne({
            $and: [
              { _id: message_id },
            //   { chat: chat_id },
            //   { 'chat.type': chatType } 
            ]
          });
          
        
        if (!message) {
            throw new Error('Message not found');
        }

        if(!message.from_user.equals(user._id)){
            throw new Error('Message not from user');
        }
    
        message.text = text;
        await message.save();

        return message
            
    }

    async createAudioMessage(data) {
        try {
          const { audio, chat_id, user_id } = data;
    
          console.log('id: ', user_id)

          const audioUrl = await mediaService.saveBase64Audio(audio);

          const media = new mediaModel({
            url: audioUrl,
            type: 'audio'
          });
          await media.save();

          const message = new messageModel({
            from_user: user_id,
            chat: chat_id,
            type: 'audio',
            media: [media._id]
          });
          await message.save();
          message.media = [media]
          return message;
        } catch (error) {
          console.error('Error creating audio message:', error);
          throw error;
        }
      }
    
      async createChatMessage({user, text, media, chat_id, reply_to_message, chatType = 'public', type = 'text'}) {
        try {
            let mediaContent = [];
            if (media && Array.isArray(media)) {
                for (const file of media) {
                    const data = await mediaService.saveFile(file);
                    const savedMedia = new mediaModel({
                        url: data.url,
                        width: data.width,
                        height: data.height,
                        aspectRatio: data.aspectRatio,
                        type: 'image', 
                    });
                    console.log(data)
                    await savedMedia.save();
                    mediaContent.push(savedMedia);
                }
            }
    
            const chat = await chatModel.findOne({_id: chat_id});
    
            if (!chat) {
                throw ApiError.BadRequest('No chat found with the provided ID');
            }
    
            const message = await this.createMessageFunc({
                chat,
                text,
                media: mediaContent,
                reply_to_message,
                user,
                type
            });
            chat.last_message = message._id;
    
            const replyMessage = await messageModel
                .findOne({_id: reply_to_message})
                .populate({ path: 'from_user', select: 'name username _id' })
                .select('text _id');
    
            await chat.save();
    
            message.reply_to_message = replyMessage;
    
            if (mediaContent.length > 0) {
                const loadedMedia = await mediaModel.find({ _id: { $in: mediaContent.map(m => m._id) } });
                if (loadedMedia) {
                    message.media = loadedMedia;
                }
            }
    
            return message;
        } catch (error) {
            console.error('Error in createChatMessage:', error);
    
            if (error instanceof ApiError) {
                throw error; 
            } else {
                throw ApiError.InternalServerError('An error occurred while creating the message');
            }
        }
    }

    async getChatMessageById(message_id){
        const message = await messageModel.findOne({_id: message_id}).populate(['from_user', 'from_user.avatar']).populate('media')
        const member = await memberModel.findOne({user: message.from_user._id, chat: message.chat})
        if (member) {
            message.from_member = member;
        }
        return message
    }
    
    async createMessageFunc({chat, text, user, reply_to_message, type = 'text', media = []}) {
        let newMessage;
    
        if (reply_to_message) {
            newMessage = await messageModel.create({
                from_user: user._id,
                chat: chat._id,
                type: type === 'combined' ? 'combined' : 'text',
                media: media.length > 0 ? media.map(m => m._id) : undefined,
                reply_to_message,
                text
            });
        } else {
            newMessage = await messageModel.create({
                from_user: user._id,
                chat: chat._id,
                type: type === 'combined' ? 'combined' : 'text',
                media: media.length > 0 ? media.map(m => m._id) : undefined,
                text
            });
        }
    
        if (!newMessage) {
            throw ApiError.BadRequest('Error when creating message');
        }
    
        const message = await messageModel.findOne({ _id: newMessage._id }).populate('from_user');
        return message;
    }
    
    

}

export default new messageService()