
import { BET_OPEN,BET_CLOSE, CHECK_BET, FETCH_BET, FETCH_INFO, RECEIVE_BET, RECEIVE_INFO, PAIR_UPDATED, UPDATED_INFO, TRANSACTION, TWODHISTORY, TOPUP, FETCH_ADMIN, RECEIVE_ADMIN, UPDATED_ADMIN, FETCH_SERVER, PAUSED_SERVER, RESUME_SERVER, ADDWINNER_NUMBER, CHECK, WINNERS, PASSWINNER_SERVER, CONNECT_SERVICE, MESSAGE, DISCONNECT_SERVICE, JOIN_SERVICE, JOINED_SERVICE, THREEDHISTORY } from "../../config/action.js"
import logger from "../../config/log/logger.js"
import { dateGenerator, decodeToken } from "../../libs/helper/generator.js";
import { fetchReceiveHis, fetchTransferHis } from "../../libs/index.js";
import Winners_2D from "../../models/2DWinners.js";
import Winners_3D from "../../models/3DWinners.js";
import Numbers_2D from "../../models/Numbers_2D.js";
import Numbers_3D from "../../models/Numbers_3D.js";
import CashInOuts from "../../models/cashInOut.js";
import Days2D from "../../models/day.js";
import User from "../../models/user.js";
import Digits_2D from "../index.js";
import * as dotenv from "dotenv";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
dotenv.config();
const region = "ap-southeast-1"
const s3Client = new S3Client({
  credentials: fromEnv(),
  region
});

const SocketLogic = (socket,io)=> {
  socket.on(FETCH_ADMIN, async (userToken) => {
    const decodedId = decodeToken(userToken);
    logger.tip("Admin is connected from " + socket.id);
    if (decodedId.id == process.env.KEY_TOKEN) {
      socket.emit(RECEIVE_ADMIN, { socketId: socket.id });
    }
  });
  socket.on(FETCH_SERVER, async (id) => {
    logger.debug(id + "Server is running");
    const DayClass = new Digits_2D(id);
    const Day = await DayClass._fetchDay();
    await socket.emit(UPDATED_ADMIN, Day);
  });
  socket.on(PAUSED_SERVER, async ({ socketId, id }) => {
    logger.tip(id + " is paused from " + socketId);
    const Day = await Days2D.findById(id);
    if (Day) {
      Day.status = false;
      await Day.save();
    }
  });
  socket.on(RESUME_SERVER, async ({ socketId, id }) => {
    logger.info(id + " is paused from " + socketId);
    const Day = await Days2D.findById(id);
    if (Day) {
      Day.status = true;
      await Day.save();
    }
  });
  socket.on(ADDWINNER_NUMBER, async ({ dayId, number }) => {
    logger.info(number + " is lucky number for dayId" + dayId);
    const Day = await Days2D.findById(dayId);
    if (Day) {
      Day.winNumber = number;
      await Day.save();
    }
  });
  socket.on(CHECK, async ({ dayId }) => {
    const Day = new Digits_2D(dayId);
    const winner = await Day._check();
    winner && socket.emit(WINNERS, winner);
  });
  socket.on(PASSWINNER_SERVER, async ({ dayId, times }) => {
    const Day = new Digits_2D(dayId);
    await Day._passWinners();
    await Day._addMoney(times, socket);
  });

  socket.on(FETCH_INFO, async (userToken) => {
    const decodedId = decodeToken(userToken);
    logger.info(decodedId.id + " is connected from " + socket.id);
    const data = await User.findOne({ _id: decodedId.id }).select("-password");
    if(data){
      socket.emit(RECEIVE_INFO, {
        code: 201,
        name: data.name,
        phone: data.phone,
        level: data.level,
        money: data.money,
        payments: data.payments,
        pin: data.pin
      });
      
     
    }else{
      logger.warn("no user found")
    }

      
  });
  socket.on(TOPUP, async (userToken) => {
    const decodedId = decodeToken(userToken);
    const Trans = await CashInOuts.find({ id: decodedId.id });
    Trans && socket.emit(TOPUP, Trans);
  });
  socket.on(TRANSACTION, async ({userToken,page}) => {
    const decodedId = decodeToken(userToken);
    const tran = await fetchTransferHis(decodedId.id);
    const rec = await fetchReceiveHis(decodedId.id);
    const numbers = await Numbers_2D.find({owner:decodedId.id});
    const winners_2D = await Winners_2D.find({id:decodedId.id});
    const winners_3D = await Winners_3D.find({id:decodedId.id});
    const numbers_3D = await Numbers_3D.find({owner:decodedId.id});
    const deposit = await CashInOuts.find({id:decodedId.id});
    const succeed = deposit.filter((e)=>e.completed&& e.status==="success")
    let Trans = tran.concat(rec).concat(numbers).concat(winners_2D).concat(succeed).concat(numbers_3D).concat(winners_3D);

     Trans.sort((a,b)=>b.createdAt - a.createdAt);
    let length = Trans.length
    Trans &&
      socket.emit(TRANSACTION, {
        length: length,
        data: Trans.slice(0, page>length?length:page)
      });
  });
  socket.on(TWODHISTORY, async (userToken) => {
    const decodedId = decodeToken(userToken);
    const data = await Numbers_2D.find({ owner: decodedId.id });

    if (data) {
      data.sort((a,b)=>b.createdAt - a.createdAt);
      socket.emit(TWODHISTORY, data);
    }
  });
  socket.on(THREEDHISTORY,async(userToken)=>{
    const decodedId = decodeToken(userToken);
    const data = await Numbers_3D.find({owner:decodedId.id});
    if(data){
      data.reverse();
      socket.emit(THREEDHISTORY, data);
    }
  } );
  // MESSAGER LOGIC
  socket.on(CONNECT_SERVICE, (userToken) => {
    const decodedId = decodeToken(userToken);
    socket.join(decodedId.id);
    io.to(decodedId.id).emit(MESSAGE, {
      id: decodedId.id,
      socketId: socket.id,
    });
    io.to(room).emit("roomJoined", `${socket.id} just joined the room`);
  });
  ///Connect service lOGIC 
  socket.on(JOIN_SERVICE, (data)=>{
    logger.debug(`${data.name} agent is joined` );
    socket.emit(JOINED_SERVICE,{message:"successfully joined"} )
  })
  // Leave a room
  socket.on(DISCONNECT_SERVICE, (room) => {
    console.log(`${socket.id} has left room ${room}`);

    socket.leave(room);

    io.to(room).emit("roomLeft", `${socket.id} has left the room`);
  });

  // Post a message to a specific room
  socket.on("messageToRoom", (data) => {
    console.log(
      `${socket.id} posted a message to room ${data.room}: ${data.message}`
    );

    io.to(data.room).emit("message", {
      id: socket.id,
      message: data.message,
    });
  });
}

export default SocketLogic