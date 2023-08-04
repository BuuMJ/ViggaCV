const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Qualified = new Schema({
  name: String,
  path: String,
  jobid: String,
  companyid: String,
  userid: String,
  // ... các trường khác của CV
});

const QualifiedModel = mongoose.model("qualified", Qualified);
module.exports = QualifiedModel;
