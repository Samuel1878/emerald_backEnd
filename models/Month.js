import mongoose, { Schema } from "mongoose";
const Month = new Schema(
  {
    status: {
      type: Boolean,
      default: true,
      require: false,
    },
    year: {
      type: String,
      require: true,
    },
    range:{
        type:String,
        default:"1/16"
    },
    start:{
        type:Number,
        default:1,
    },
    end:{
        type:Number,
        default:16
    },
    month: {
      type: String,
      require: true,
    },
    isOver: {
      type: Boolean,
      default: false,
      require: false,
    },
    volume: {
      type: Number,
      default: 0,
    },
    maxVolume: {
      type: Number,
      default: 100000000,
    },
    investors: {
      type: Array,
      default: 0,
    },
    winNumber: {
      type: Number,
      default: null,
      require: false,
    },
    sold: {
      type: Array,
      default: 0,
    },
    Bets: {
      type: Map,
    },
    bets: {
      type: Object,
      default:{},

    },
  },
  {
    timestamps: true,
  }
);
const SemiMonth = mongoose.model("3D_SemiMonth", Month);
export default SemiMonth;
