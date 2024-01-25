
import  { fetchLive, fetchResults, fetchTwoD, fetchthreed } from "../libs/dataFetcher.js";
import logger from "../config/log/logger.js";
import { decodeToken } from "../libs/helper/generator.js";
import User from "../models/user.js";
import Digits_2D from "../data/index.js";
import Winners_2D from "../models/2DWinners.js";
import Winners_3D from "../models/3DWinners.js";

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
        const {filename, path} = req.file;
        if (!filename || !path) {
          return res
            .status(401)
            .json({ success: false, message: "No file provided." });
        }
        logger.debug(filename + ">FILE<" + path);
        const decodedId = decodeToken(userToken);
        const user = await User.findOne({_id:decodedId.id}).select("-password");
        if(user){
            user.profile = filename;
            user.profilePath = path;
            try{
                await user.save()
            }catch(err){
                res.status(401).json({ message: "Saving error:check info" });
            }
            res.status(200).json({ message: "successfully uploaded" });
            return
        }
        res.status(401).json({ message: "User not found" });

    },
    userData:async(req,res,next)=>{
        const token = req.query.token;
        const decodedId = decodeToken(token);
        const data = await User.findOne({_id:decodedId.id}).select("-password");
        if(data){
            logger.info(decodedId.id, "TOKEN:"+ token)
            res.json({      
                code:201,
                money:data.money,
                image:data.image,
                payments:data.payments,
                pin:data.pin
                });
            return
        }res.json({code:403,message:"User not found"})

    },
    twoD:async(req,res,next)=>{
        const params = req.query.param;
        logger.debug(params);
        switch (params) {
            case "live":
                const live = await fetchLive();
                res.status(200).json(live);
                break;
            case "results":
                const results = await fetchResults();
                res.status(200).json(results);
                break;
            case "threed":
                const threed = await fetchthreed();
                res.status(200).json(threed);
                break;
            default:
                res.status(403).json("Invalid Params")
                break;
        }
    

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
            photo:e?.image,
        }));
        const sortGainers = gainer.sort((a,b)=>b.amount - a.amount)
        res.status(200).json(sortGainers);
    },
    isUserRegistered:async(req,res,next)=>{
        const {number} = req.query;
        const users = await User.findOne({phone:number}).select("-password");
        if(users){
            
            res.status(200).json({phone:users.phone,name:users.name})
            return
        }
        res.status(403).json({message:"User not found"})
    },
    _calender:async(req,res,next)=>{
        
    }
    
    
}
export default dataController;
