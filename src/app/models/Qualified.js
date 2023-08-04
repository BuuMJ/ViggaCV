const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Qualified = new Schema({
  nameCV: String,
  name: String,
  email: String,
  phone: String,
  path: String,
  jobid: String,
  companyid: String,
  userid: String,
});

const QualifiedModel = mongoose.model("qualified", Qualified);
module.exports = QualifiedModel;
