import { Schema, model } from "mongoose";


const memberSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "User"},
    role: {type: String, default: "MEMBER"},
    chat: {type: Schema.Types.ObjectId, ref: "PublicChat"},
    can_send_messages: {type: Boolean, default: true},
    can_ban_users: {type: Boolean, default: false},
    can_assign_admins: {type: Boolean, default: false},
})

export default model("Member", memberSchema)