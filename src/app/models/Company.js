const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Company = new Schema(
  {
    iduser: String,
    companyname: String,
    companyaddress: String,
    companyfield: String,
    taxcode: String,
    companyemail: String,
    companyphone: String,
    companyyears: String,
    typeofbusiness: String,
    companydesc: String,
    avatar: String,
    background: String,
    jobcount: String,
    noofemployee: String,
    servicedesc: String,
    establisheddate: String,
    mission: String,
    history: String,
    leadership: [
      {
        avatar: String,
        name: String,
        position: String,
        introduce: String,
      }
    ]
  },
  {
    collection: "company",
  }
);

const CompanyModel = mongoose.model("company", Company);
module.exports = CompanyModel;
