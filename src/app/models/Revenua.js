const mongoose = require("mongoose");
const moment = require("moment-timezone");

const Schema = mongoose.Schema;

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
      enum: ["post job", "prioritize", "refund"],
      required: true,
    },
    jobname: String,
    paymentId: String,
    refundUpdateAt: {
      type: Date,
      default: Date.now,
    },
    admin: String,
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        if (ret.createdAt) {
          ret.createdAt = moment(ret.createdAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY");
        }
        if (ret.updatedAt) {
          ret.updatedAt = moment(ret.updatedAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY");
        }
      },
    },
  }
);

const RevenueModel = mongoose.model("revenue", revenueSchema);
module.exports = RevenueModel;
