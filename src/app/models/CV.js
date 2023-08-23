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
    maincontent: String,
    othercontent: String,
    experience: {
      timeexperience: String,
      nameexperience: String,
      experience: String,
    },
    experience1: {
      timeexperience1: String,
      nameexperience1: String,
      experience1: String,
    },
    experience2: {
      timeexperience2: String,
      nameexperience2: String,
      experience2: String,
    },
    experience3: {
      timeexperience3: String,
      nameexperience3: String,
      experience3: String,
    },
    experience4: {
      timeexperience4: String,
      nameexperience4: String,
      experience4: String,
    },
    education: {
      nameeducation: String,
      timeeducation: String,
      education: String,
    },
    education1: {
      nameeducation1: String,
      timeeducation1: String,
      education1: String,
    },
    education2: {
      nameeducation2: String,
      timeeducation2: String,
      education2: String,
    },
    education3: {
      nameeducation3: String,
      timeeducation3: String,
      education3: String,
    },
    education4: {
      nameeducation4: String,
      timeeducation4: String,
      education4: String,
    },
    project: {
      timeproject: String,
      nameproject: String,
      descript_content: String,
      clientcontent: String,
      members_content: String,
      position_content: String,
      respon_content: String,
    },
    project1: {
      timeproject1: String,
      nameproject1: String,
      descript_content1: String,
      clientcontent1: String,
      members_content1: String,
      position_content1: String,
      respon_content1: String,
    },
    project2: {
      timeproject2: String,
      nameproject2: String,
      descript_content2: String,
      clientcontent2: String,
      members_content2: String,
      position_content2: String,
      respon_content2: String,
    },
    project3: {
      timeproject3: String,
      nameproject3: String,
      descript_content3: String,
      clientcontent3: String,
      members_content3: String,
      position_content3: String,
      respon_content3: String,
    },
    project4: {
      timeproject4: String,
      nameproject4: String,
      descript_content4: String,
      clientcontent4: String,
      members_content4: String,
      position_content4: String,
      respon_content4: String,
    },
  },
  {
    collection: "cv",
  }
);

const CVModel = mongoose.model("cv", CV);
module.exports = CVModel;
