import mongoose, { Schema } from "mongoose";
const Winners3D = new Schema(
  {
    id: {
      type: String,
      require: true,
    },
    name: {
      type: String,
      default: "Mr/Ms...",
    },
    phone: {
      type: String,
      required: true,
    },
    luckyNo: {
      type: String,
      require: true,
    },
    capital: {
      type: Number,
      required: true,
    },
    earn: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const Winners_3D = mongoose.model("Winners_3D", Winners3D);
export default Winners_3D;
