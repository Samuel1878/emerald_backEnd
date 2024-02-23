import mongoose, { Schema } from "mongoose";
const Transaction = new Schema(
  {
    date: {
      type: Number,
      require: true,
    },
    month:{
      type:Number,
      default:0
      
    },
    year:{
      type:Number,
      default:2024
    },
    time: {
      type: String,
      require: true,
    },
    to: {
      type: String,
      require: true,
    },
    from: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    toPhone: {
      type: String,
      required: true,
    },
    fromPhone: {
      type: String,
      required: true,
    },
    toName: {
      type: String,
      require: true,
    },
    fromName: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const Transactions = mongoose.model("Transactions", Transaction);
export default Transactions;
