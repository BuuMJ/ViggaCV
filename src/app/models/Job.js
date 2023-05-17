const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Job = new Schema(
  {
    iduser: String,
    companyname: String,
    jobname: String,
    jobdesc: String,
    jobrequi: String,
    joblocation: String,
    salary: String,
    avatar: String,
  },
  {
    timestamps: true,
  },
  {
    collection: "job",
  }
);

const JobModel = mongoose.model("job", Job);
module.exports = JobModel;
