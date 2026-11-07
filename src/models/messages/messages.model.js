import mongoose from "mongoose";

const msgSchema = new mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat',
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:['user','ai'],
        required:true,
    }
},
{
    timestamps:true
})

const messageModel = mongoose.model("Message",msgSchema)

export default messageModel;