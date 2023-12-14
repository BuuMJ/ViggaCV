const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Qualified = new Schema(
  {
    nameCV: String,
    name: String,
    email: String,
    phone: String,
    path: String,
    namePath: String,
    jobid: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    companyid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    professional: String,
    score: String,
  },
  {
    timestamps: true,
  }
);

const QualifiedModel = mongoose.model("qualified", Qualified);
module.exports = QualifiedModel;
