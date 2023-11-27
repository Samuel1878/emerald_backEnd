import mongoose, { Schema } from "mongoose";
const Numbers3D = new Schema(
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
    range: {
      type: String,
      required: true,
    },
    MonthId: {
      type: String,
      require: true,
    },
    time: {
      type: Number,
      require: false,
    },
    year: {
      type: String,
      require: true,
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
  },
  {
    timestamps: true,
  }
);
const Numbers_3D = mongoose.model("Numbers3D", Numbers3D);
export default Numbers_3D;
