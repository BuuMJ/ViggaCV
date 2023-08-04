const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Viewed = new Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ViewedModel = mongoose.model("viewed", Viewed);
module.exports = ViewedModel;
