import express from "express";
import * as dotenv from "dotenv";
import http from "http";
import logger from "./config/log/logger.js";
import middleware from "./middlewares/index.js";
import Routes from "./routes/index.js";
import connectDB from "./config/database.js";
import socketServer from "./libs/helper/socket.js";
import SocketLogic from "./data/socketio/sockets.js";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
let db;
middleware(app);
Routes(app);
(
    async function(){
        db = await connectDB();
    }
    
)();


const io = socketServer(httpServer);
io.on("connection", (socket)=>SocketLogic(socket,io));

httpServer.listen(process.env.PORT, process.env.HOST, (err)=>{
    if(err)logger.err(err);
    logger.info( `Server is running at ${process.env.HOST}  :${process.env.PORT}`)   

    
});

//Error handling and close server
process.on('unhandledRejection', (err)=>{
  db?.disconnect();
  logger.err(err.message);
  httpServer.close(()=>{
    process.exit(1);
  });
  
});
