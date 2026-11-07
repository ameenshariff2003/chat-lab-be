import { Router } from "express";
import { sendMessage,getChats,getMessages ,deleteChats} from "../../controlers/chat/chat.ctrl.js";
import { middlewareAll } from "../../middleware/auth.middleware.js";

const chatRouter = Router();


chatRouter.post("/message",middlewareAll.getme,sendMessage)

chatRouter.get("/",middlewareAll.getme,getChats)
chatRouter.get("/:chatId/message",middlewareAll.getme,getMessages)
chatRouter.delete("/delete/:chatId",middlewareAll.getme,deleteChats)








export default chatRouter;