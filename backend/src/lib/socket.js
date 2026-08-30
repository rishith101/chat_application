import { Socket } from "dgram";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app=express();

// Create an HTTP server
// This wraps your Express app inside an HTTP server.
// Think of it like:
// Express app
//     ↓
// HTTP server

// Why do this?Because Socket.IO needs to connect to an actual HTTP server.So instead of simply doing:
// app.listen(...)
// you create:
// HTTP Server
//    ├── Express
//    └── Socket.IO

const server=http.createServer(app);


const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173" ;
const io=new Server(server,{cors:{origin:[allowedOrigin]}});

// online users  -> {userid:socketid}
const userSocketMap={};

function getReciverSocketId(userId){
    return userSocketMap[userId];
}
io.on("connection",(socket) =>{
    const userId=socket.handshake.query.userId;
    if(userId) userSocketMap[userId]=socket.id;
    //when an user gets online it need to know of all the users . so emmit
    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect",()=>{
        if(userId){
            delete userSocketMap[userId];
            io.emit("getOnlineUsers",Object.keys(userSocketMap));
        }
    })
}) 

export {app,server,io,getReciverSocketId};

