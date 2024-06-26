import mongoose from "mongoose";

const user = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    level:{
        type:Number,
        default:1
    },
    money:{
        type:Number,
        default:0,
    },
    profile:{
        type:String
    },
    profilePath:{
        type:String
    },
    profileType:{
        type:String
    },
    payments:{
        type:Array,
        default:[]
    },
    earn:{
        type:Number,
        default:0
    },
    pin:{
        type:String,
        default:null
    }
},{
    timestamps:true
});
const User = mongoose.model("User", user);
export default User;