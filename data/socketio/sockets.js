
import { BET_OPEN,BET_CLOSE, CHECK_BET, FETCH_BET, FETCH_INFO, RECEIVE_BET, RECEIVE_INFO, PAIR_UPDATED, UPDATED_INFO, TRANSACTION, TWODHISTORY, TOPUP, FETCH_ADMIN, RECEIVE_ADMIN, UPDATED_ADMIN, FETCH_SERVER, PAUSED_SERVER, RESUME_SERVER, ADDWINNER_NUMBER, CHECK, WINNERS, PASSWINNER_SERVER } from "../../config/action.js"
import logger from "../../config/log/logger.js"
import { dateGenerator, decodeToken } from "../../libs/helper/generator.js";
import { fetchReceiveHis, fetchTransferHis } from "../../libs/index.js";
import Numbers_2D from "../../models/Numbers_2D.js";
import CashInOuts from "../../models/cashInOut.js";
import Days2D from "../../models/day.js";
import Transactions from "../../models/transaction.js";
import User from "../../models/user.js";

import Digits_2D from "../index.js";
const SocketLogic = (socket,io)=> {
    socket.on(FETCH_ADMIN,async(userToken)=>{
        const decodedId = decodeToken(userToken);
        logger.tip("Admin is connected from " + socket.id);
        if(decodedId.id == process.env.KEY_TOKEN){
            socket.emit(RECEIVE_ADMIN,{socketId:socket.id});
            
        }
    });
    socket.on(FETCH_SERVER,async(id)=>{
        logger.debug(id + "Server is running");
        const DayClass = new Digits_2D(id);
        const Day = await DayClass._fetchDay();
        await socket.emit(UPDATED_ADMIN, Day);
        
    });
    socket.on(PAUSED_SERVER,async({socketId,id})=>{
        logger.tip(id + " is paused from " + socketId);
        const Day = await Days2D.findById(id);
        if(Day ){
            Day.status = false
            await Day.save();
        }
    });
    socket.on(RESUME_SERVER,async({socketId,id})=> {
        logger.info(id + " is paused from " + socketId);
        const Day = await Days2D.findById(id);
        if(Day){
            Day.status = true;
            await Day.save();
        }
    });
    socket.on(ADDWINNER_NUMBER, async({dayId,number})=>{
        logger.info(number + "is lucky number for dayId" + dayId);
        const Day = await Days2D.findById(dayId);
        if(Day){
            Day.winNumber = number;
            await Day.save();
        }
    });
    socket.on(CHECK, async({dayId})=>{
        const Day = new Digits_2D(dayId);
        const winner = await Day._check();
        winner && socket.emit(WINNERS, winner);
    })
    socket.on(PASSWINNER_SERVER,async({dayId})=>{
        const Day = new Digits_2D(dayId);
        Day._passWinners();

    })
    socket.on(FETCH_INFO,async(userToken)=>{
        const decodedId = decodeToken(userToken);
        logger.info(decodedId.id + " is connected from " + socket.id);
        const data = await User.findOne({_id:decodedId.id}).select("-password");
         data && socket.emit(RECEIVE_INFO,
                {code:201,
                name:data.name,
                phone:data.phone,
                level:data.level,
                money:data.money,
                image:data.image?Buffer.from(data.image):null,
                payments:data.payments,
                pin:data.pin,
                imageType:data.imageType
                });
    });
    socket.on(TOPUP,async(userToken)=>{
          const decodedId = decodeToken(userToken);
          const Trans = await CashInOuts.find({id:decodedId.id});
          Trans && socket.emit(TOPUP,Trans);
    });
    socket.on(TRANSACTION,async(userToken)=>{
         const decodedId = decodeToken(userToken);
         const tran = await fetchTransferHis(decodedId.id);
            const rec = await fetchReceiveHis(decodedId.id);
            let Trans = tran.concat(rec);

          Trans && socket.emit(TRANSACTION, Trans);
         
    });
    socket.on(TWODHISTORY,async(userToken)=>{
    
        const decodedId = decodeToken(userToken);
        const data = await Numbers_2D.find({owner:decodedId.id});
            
        if(data){
            data.reverse();
            socket.emit(TWODHISTORY, data)
        }
    });
    socket.on(BET_OPEN,({date,limit})=>{
        

    });
     socket.on(BET_CLOSE, () => {
        
     });
      socket.on(CHECK_BET, () => {
      
      });
    socket.on(PAIR_UPDATED,()=>{
     
    })

}

export default SocketLogic