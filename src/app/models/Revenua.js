const mongoose = require("mongoose");
const { Schema } = mongoose;

const revenueSchema = new Schema(
  {
    iduser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idcompany: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    idjob: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    money: { type: Number, required: true },
    type: {
      type: String,
      enum: ["post job", "prioritize"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RevenueModel = mongoose.model("revenue", revenueSchema);
module.exports = RevenueModel;
