import {Server} from "socket.io"

let io;
export function initSocket(httpserver){
    io = new Server(httpserver,{
        cors:{
            origin:process.env.CLIENTURI,
            credentials:true,
        }
    })
    console.log("Socket.io Server is running")

    io.on("connection",(socket)=>{
        console.log("A user connected: "+socket.id)
    })

}

export function getIo(){
    if(!io){
        throw new Error("Socket is not Connected")
    }
    return io
}