const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CV = new Schema(
  {
    iduser: String,
    specialized: String,
    fullname: String,
    email: String,
    avatar: String,
    phone: String,
    overview: String,
    name: String,
    birthday: String,
    address: String,
    timeexperience: String,
    nameexperience: String,
    experience: String,
    timeeducation: String,
    nameeducation: String,
    education: String,
    maincontent: String,
    othercontent: String,
    nameclient: String,
  },
  {
    collection: "cv",
  }
);

const CVModel = mongoose.model("cv", CV);
module.exports = CVModel;
