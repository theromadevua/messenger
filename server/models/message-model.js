import { Schema, model } from "mongoose";


const Message = new Schema({
    from_user: {type: Schema.Types.ObjectId, ref: "User"},
    text: {type: String},
    chat: {type: Schema.Types.ObjectId, refPath: "chatModel"},
    createdAt: {type: Date, default: Date.now},
    isEdited: {type: Boolean, default: false},
    type: {
        type: String,
        enum: ['text', 'system', 'audio', 'media', 'combined'],
        default: 'text'
    },
    metadata: {
        action: String,
        data: {}
    }, 
    media: [{type: Schema.Types.ObjectId, ref: 'Media'}],
    reply_to_message: {type: Schema.Types.ObjectId, ref: 'Message'},
    from_member: {}
})

export default model("Message", Message)