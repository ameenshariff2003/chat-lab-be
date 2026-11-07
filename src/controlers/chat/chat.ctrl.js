import {generateResponse, generateTitle} from "../../services/ai.service.js"
import messageModel from "../../models/messages/messages.model.js";
import chatModel from "../../models/chat/chat.model.js";




export async function sendMessage(req,res) {

    const {message, chat:chatId} = req.body;

    let title=null,chat=null;

    if(!chatId){
        title= await generateTitle(message)
        chat = await chatModel.create({
        user:req.user.id,
        title

    })
    }





    const userMessage = await messageModel.create({
        chat:chatId ||chat._id,
        content:message,
        role:"user"
    })

    const messages = await messageModel.find({chat : chatId ||chat._id})
    console.log(messages)

    const result = await generateResponse(messages)


    const aiMessage = await messageModel.create({
        chat:chatId ||chat._id,
        content:result,
        role:"ai"
    })
    

    console.log(title)

    res.json({
        aimsg:result,
        title,
        chat,
        aiMessage

    })
    
}

export async function getChats(req,res){
    const user = req.user

    const chats = await chatModel.find({user:user.id})

    res.status(200).json({
        msg:"chats recived",
        chats
    })
}

export async function getMessages(req,res){
    const {chatId} = req.params;

    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            msg : "chat not found"
        })
    }

    const messages = await messageModel.find({
        chat:chatId
    })

    res.status(200).json({
        msg : "messages retrived success",
        messages
    })
}

export async function deleteChats(req,res){
    const {chatId} = req.params;

    const chat = await chatModel.findByIdAndDelete({
        _id:chatId,
        user:req.user.id
    })

    await messageModel.deleteMany({
        chat:chatId
    })

    if(!chat){
        return res.status(404).json({
            msg:"chat not found"
        })
    }

    res.status(200).json({
        msg:"Chat deleted success"
})
}