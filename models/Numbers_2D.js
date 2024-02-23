import mongoose, { Schema } from "mongoose";
const Numbers2D = new Schema(
  {
    number: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    section: {
      type: String,
      required: true,
    },
    dayId: {
      type: String,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    time: {
      type: Number,
      require: false,
    },
    month: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      required: true,
    },
    finished: {
      type: Boolean,
      require: false,
      default: false,
    },
    win:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);
    const Numbers_2D = mongoose.model("Numbers2D", Numbers2D);
    export default Numbers_2D;