
import  { fetchLive, fetchResults, fetchTwoD, fetchthreed } from "../libs/dataFetcher.js";
import logger from "../config/log/logger.js";
import { decodeToken } from "../libs/helper/generator.js";
import User from "../models/user.js";
import Digits_2D from "../data/index.js";
import Winners_2D from "../models/2DWinners.js";
import Winners_3D from "../models/3DWinners.js";
import axios from "axios";
import instanceReq from "../libs/helper/axios.js";
import { fetchReceiveHis, fetchTransferHis } from "../libs/index.js";
import {S3Client,PutObjectCommand,GetObjectCommand} from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
const region = "ap-southeast-1";
export const s3Client = new S3Client({
  credentials: fromEnv(),
  region,
});

const dataController = {
    nameChange:async(req,res,next)=>{
        const {userToken, name} = req.body;
        const decodedId = decodeToken(userToken);
        const user = await User.findOne({_id:decodedId.id}).select("-password");
        if(user){
            user.name = name;
            logger.info(name + "changed successfully");
            user.save();
            res.status(200).json({message:"successfully changed"})
            return
        }
        res.status(401).json({message:"User not found"})
    },
    profileChange:async(req,res,next)=>{
        const {userToken} = req.query;
        const file = req.file;
        if (!file) {
          res
            .status(401)
            .json({ message: "No file provided." });
            return 
        }
         
        const decodedId = decodeToken(userToken);
        const user = await User.findOne({_id:decodedId.id}).select("-password");
        if(user){
              try {
                user.profile = file.originalname;
                logger.tip(file.originalname)
                const writeParams = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: process.env.PROFILE_OBJECT_KEY + user._id,
                  Body:file.buffer,
                  ContentType:file.mimetype
                };
                s3Client
                    .send(new PutObjectCommand(writeParams))
                    .then((e)=>{
                        logger.debug(e);
                    }).catch((e)=>logger.warn(e));
                await user.save();
              } catch (err) {
                console.error(err)
                // res.status(404).json({ message: "Saving error:check info" });
              }
            res.status(200).json({ message: "successfully uploaded" });
            return
        } else {
           res.status(403).json({ message: "User not found" });
        }
    },
    userData:async(req,res,next)=>{
        const token = req.query.token;
        const decodedId = decodeToken(token);
        const data = await User.findOne({_id:decodedId.id}).select("-password"); 
        if(!data){
           return res.json({ code: 403, message: "User not found" });
        }
        const readParam = {
          Bucket: process.env.BUCKET_NAME,
          Key: process.env.PROFILE_OBJECT_KEY + data._id,
        };
        s3Client
          .send(new GetObjectCommand(readParam))
          .then((e) => {
            const str = e.Body.transformToString("base64")
            str.then((a) => res.status(201).json(`data:image/${e.ContentType};base64,${a}`));
            
            return;
          })
          .catch((e) => {
            logger.warn(e);
            res.status(404).json(e)
          });
       

    },
    addDepoPhoto:async(req,res,next)=>{
        const file = req.file;
        const {id} = req.query;
        const writeParams = {
          Bucket: process.env.BUCKET_NAME,
          Key: process.env.DEPOSIT_OBJECT_KEY + id,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        s3Client
          .send(new PutObjectCommand(writeParams))
          .then((e) => {
            res.status(201).json({message:"sucessfully add depo"})
          })
          .catch((e) => res.status(404).json({message:e}));
    },
    threeD:async(req,res,next)=>{
        const options = {
          method: "GET",
          url: "https://shwe-2d-live-api.p.rapidapi.com/3d-live",
          headers: {
            "X-RapidAPI-Key":
              "2ebad97563msh9ab84284298e633p12a16cjsnd20f2d3f24a4",
            "X-RapidAPI-Host": "shwe-2d-live-api.p.rapidapi.com",
          },
        };
        const response = await instanceReq(options);
        if(res){
            res.status(200).json(response);
            return
        };
        res.status(401).json({message:"ERROR WITH API"})

    

    },
    history2D:async(req,res,next)=>{
        const {page,limit} = req.query;
        logger.tip("2d History reqested:"+ page+ " : " + limit);
            const twoD =  await fetchTwoD({page,limit});
            res.status(200).json(twoD);
    },
    bets2D:async(req,res,next)=>{
        const {id,betDate} = req.query;
        const digit = new Digits_2D(id,betDate,100000);
        await digit.getBetDigits();
        await res.status(201).json(digit);
    },
    addPayments:async(req,res,next)=>{
        const {userToken, method,name,phone} = req.body;
         const decodedId = decodeToken(userToken);
         const payments = {method:method,name:name,phone:phone};
         const user = await User.findOne({ _id: decodedId.id }).select(
           "-password"
         );
         if(user){
            user.payments.push(payments);
            res.status(201).json({message:"Payments successfully added"});
            await user.save();
            return
         }
         res.status(403).json({message:"User not found!"});
    },
    deletePayments: async(req,res,next)=>{
        const {userToken, method, name , phone} = req.body;
        const decodedId = decodeToken(userToken);
        const user = await User.findOne({_id:decodedId.id});
        if(user){
            const newArry = user.payments.filter((obj)=>obj.name !== name || obj.phone !== phone || obj.method !== method);
            user.payments = newArry;
            await user.save();
            res.status(201).json({message:"successful"});
            return 
        }
        res.status(401).json({ message: "user not found" });
    },
    _2dWinners:async(req,res,next)=>{
        const {page} = req.query;
       const winners = await Winners_2D.find({});
       res.status(201).json(winners);


        
    },
    _3dWinners:async(req,res,next)=>{
        const { page } = req.query;
        const winners = await Winners_3D.find({});
        res.status(201).json(winners);

    },
    _topGainers:async(req,res,next)=>{
        const users = await User.find({}).select("-password");
        const gainers = users.filter((e)=>e.earn>0);
        const gainer = gainers.map((e)=>({
            amount:e.earn,
            name:e.name,
            phone:e.phone,
            photo:e?.profile,
        }));
        const sortGainers = gainer.sort((a,b)=>b.amount - a.amount)
        res.status(200).json(sortGainers);
    },
    isUserRegistered:async(req,res,next)=>{
        const {number} = req.query;
        const users = await User.findOne({phone:number}).select("-password");
        if (!users) {
             res.status(403).json({ message: "User not found" });
             return
        }   
            const readParam = {
              Bucket: process.env.BUCKET_NAME,
              Key: process.env.PROFILE_OBJECT_KEY + users._id,
            };
            s3Client
              .send(new GetObjectCommand(readParam))
              .then((e) => {
                const str = e.Body.transformToString("base64");
                str.then((a) =>
                 res.status(200).json({
                   phone: users.phone,
                   name: users.name,
                   profile:`data:image/${e.ContentType};base64,${a}`,
                 })
                )
              })
              .catch((e) => {
                logger.warn(e);
                res.status(404).json(e);
              });
      
    },
    _calender:async(req,res,next)=>{
        
    },
    _getTransactions:async(req,res,next)=>{
        const {userToken} = req.query;
        const userId = decodeToken(userToken);
        const tran = await fetchTransferHis(userId.id);
        const rec = await fetchReceiveHis(userId.id);
        let Trans = tran.concat(rec);
        if(Trans && Trans.length){
            res.status(200).json(Trans)
            return
        }
        res.status(401).json({message:"ERROR: cannot fetch Transactions"})
    }
    
    
}
export default dataController;
