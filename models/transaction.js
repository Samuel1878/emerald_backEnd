import mongoose, { Schema } from "mongoose";
const Transaction = new Schema(
  {
    date: {
      type: String,
      require: true,
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
