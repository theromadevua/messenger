import { Schema, model } from "mongoose";


const Media = new Schema({
    type: {type: String, default: 'audio'},
    width: {type: Number},
    height: {type: Number},
    aspectRatio: {type: Number},
    url: {type: String}
})

export default model("Media", Media)