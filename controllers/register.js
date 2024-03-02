
import { gOTP } from "../libs/helper/generator.js";
import { generateUsername } from "unique-username-generator";
import User from "../models/user.js";
import { s3Client } from "./dataController.js";

const register = {
    createUser:async(req,res,next)=>{
       const {phone, password}= req.body;
       const name = generateUsername(" ",2);
        const isUser = await User.findOne({phone:phone});
        if(isUser){
             res.json({code:403,message:"User already exit"});
             return
        };
        const userData = new User({
            name:name,
            phone:phone,
            password:password
        });
        await userData.save();
        const writeParams = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: process.env.PROFILE_OBJECT_KEY + userData._id,
                  Body:file.buffer,
                  ContentType:file.mimetype
                };
        s3Client
            .send(new PutObjectCommand(writeParams))
            .then((e)=>{
                logger.debug(e);
                })
            .catch((e)=>logger.warn(e));
        res.json({code:201,message:`${name}just created an acount`});
        next();
    },
    OTPverification:(req,res,next)=>{
        const {phone} = req.body;
        const OTP = gOTP();
        res.status(201).json({OTP:OTP});
    },
}
export default register;