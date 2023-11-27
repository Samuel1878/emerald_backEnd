import mongoose, { Schema } from "mongoose";
const CashInOut = new Schema(
  {
    completed: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      default: "pending",
    },
    id: {
      type: String,
      require: true,
    },
    type: {
      type: String,
      require: true,
    },
    method: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
    },
    oneTimeNo: {
      type: Number,
      require: false,
      default: null,
    },
    file: {
        type:String,
      require: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const CashInOuts = mongoose.model("CashInOut", CashInOut);
export default CashInOuts;
