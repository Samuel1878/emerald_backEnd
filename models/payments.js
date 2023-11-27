import mongoose, { Schema } from "mongoose";
const Payment = new Schema(
  {
    method: {
      type: String,
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
    maximum: {
      type: Number,
      require: false,
      default: 1000000,
    },
    qr: {
      type: String,
      require: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const Payments = mongoose.model("Payments", Payment);
export default Payments;
