import { decodeToken, gToken } from "../libs/helper/generator.js";
import User from "../models/user.js";

const login = async(req,res,next)=>{
    const {phone,password} = req.body;
    const isUser = await User.findOne({phone:phone});
    if(isUser && (password === isUser.password)){
        res.json({
            token:gToken(isUser._id),
            code:201,
            message:"successfuly logged in"
        })
    }else{
        res.json({code:401, message:"invalid phone or password"})
    }
}
export const resetControllers = {
    resetPin:async(req,res,next)=>{
        const {userToken,newPin} = req.body;
         const decodedId = decodeToken(userToken);
         const user = await User.findOne({ _id: decodedId.id});
         if(user){
            user.pin = newPin;
            user.save();
            res.status(201).json({message:"successfully changed"});
            return
         }
        res.status(404).json({ message: "user not found" });
    },
    resetPassword:async(req,res,next)=>{
        const { userToken, newPwd } = req.body;
        const decodedId = decodeToken(userToken);
        const user = await User.findOne({ _id: decodedId.id });
        if (user) {
        user.password = newPwd;
        user.save();
        res.status(201).json({ message: "successfully changed" });
        return
        }
        res.status(404).json({"message":"user not found"})

    }
}
export default login;