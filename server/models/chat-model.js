import { Schema, model } from "mongoose";


const Chat = new Schema({
    name: {type: String, required: true},
    link: {type: String},
    messages: [],
    avatar: {type: Schema.Types.ObjectId, ref: "Media"},
    last_message: {type: Schema.Types.ObjectId, ref: "Message"},
    members: [{type: Schema.Types.ObjectId, ref: "Member"}],
    description: {type: String, default: ''},
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    type: { type: String, enum: ['private', 'public'], required: true },
    isPublic: Boolean,
    with_user: { type: Schema.Types.ObjectId, ref: "User" },
    chatWallpaper: {
        data: {
            isBlurred: {type: Boolean, default: false},
            blackout: {type: Number, default: 0},
        },
        media: {type: Schema.Types.ObjectId, ref: "Media"}
    }, 
});

export default model("Chat", Chat)