import mongoose, { Schema } from "mongoose";
const Winners2D = new Schema({ 
    id:{
        type:String,
        require:true
    },
    name:{
      type:String,
      default:"Mr/Ms..."
    },
    phone: {
      type: String,
      required: true,
    },
    luckyNo:{
        type:String,
        require:true
    },
    capital: {
      type: Number,
      required: true,
    },
    earn: {
      type: Number,
      required: true,
    },
    times:{
      type:Number,
      require:false
    },
    dayId:{
      type:String,
      require:true
    }
  },
  {
    timestamps: true,
  }
);
const Winners_2D = mongoose.model("Winners_2D",Winners2D );
export default Winners_2D;
