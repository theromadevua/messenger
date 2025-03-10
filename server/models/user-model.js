import { Schema, model } from "mongoose";

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String},
    username: {type: String, unique: true},
    avatar: {type: Schema.Types.ObjectId, ref: 'Media'},
    role: {type: String, default: 'user'},
    description: {type: String, default: ''},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    online: {type: Boolean, default: false},
    publicChats: [{type: Schema.Types.ObjectId, ref: "PublicChat"}],
    // savedMessages: {type: Schema.Types.ObjectId, ref: "SavedMessages"}
})

const User = model('User', UserSchema)
export default User