const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CV = new Schema(
  {
    iduser: String,
    fullnamecv: String,
    emailcv: String,
    avatarcv: String,
    phonecv: String,
    overview: String,
    namecompany: String,
    addrcompany: String,
    durationcompany: String,
    nameprofession: String,
    descprofession: String,
    nameschool: String,
    addrschool: String,
    durationschool: String,
    nameprofessionschool: String,
    descprofessionschool: String,
    descproject: String,
    nameproject: String,
    nameskill: String,
    skilllv1: String,
    skilllv2: String,
    skilllv3: String,
    skilllv4: String,
    skilllv5: String,
    activities: String,
  },
  {
    collection: "cv",
  }
);

const CVModel = mongoose.model("cv", CV);
module.exports = CVModel;
