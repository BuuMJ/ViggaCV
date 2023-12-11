const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unsatisfactory = new Schema({
  nameCV: String,
  name: String,
  email: String,
  phone: String,
  path: String,
  jobid: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  companyid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  professional: String,
  score: String,
  userid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const UnsatisfactoryModel = mongoose.model("unsatisfactory", Unsatisfactory);
module.exports = UnsatisfactoryModel;
