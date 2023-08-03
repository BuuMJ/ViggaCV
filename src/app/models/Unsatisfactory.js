const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Unsatisfactory = new Schema({
  name: String,
  path: String,
  jobid: String,
  companyid: String,
  // ... các trường khác của CV
});

const UnsatisfactoryModel = mongoose.model("unsatisfactory", Unsatisfactory);
module.exports = UnsatisfactoryModel;
