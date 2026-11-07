import dotenv from "dotenv"
dotenv.config()

import express from "express"

import app from "./src/app.js"
import dbConnect from "./src/config/db.js"
import cookieParser from "cookie-parser"
import http from "http"
import router from "./src/routes/user/user.route.js"
import chatRouter from "./src/routes/chat/chat.route.js"
import morgan from "morgan"
import cors from "cors"
import { initSocket } from "./src/socket/server.socket.js"

const httpServer = http.createServer(app);

initSocket(httpServer);
dbConnect()


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"))
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}))



app.use("/",router)
app.use("/chat",chatRouter)


httpServer.listen(8080,()=>{
    console.log("server is running")
})