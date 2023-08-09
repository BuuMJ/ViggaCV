const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unsatisfactory = new Schema({
  nameCV: String,
  name: String,
  email: String,
  phone: String,
  path: String,
  jobid: String,
  companyid: String,
  professional: String,
  userid: String,
});

const UnsatisfactoryModel = mongoose.model("unsatisfactory", Unsatisfactory);
module.exports = UnsatisfactoryModel;
