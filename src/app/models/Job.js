const mongoose = require("mongoose");
const moment = require("moment-timezone");

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
    idcompany: String,
    benefit: String,
    position: String,
    categories: String,
    active: {
      type: Boolean,
      default: true,
    },
    prioritize: {
      type: Boolean,
      default: false,
    },
    prioritizeUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        if (ret.DoP) {
          ret.DoP = moment(ret.DoP).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY");
        }
        if (ret.createdAt) {
          ret.createdAt = moment(ret.createdAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY");
        }
        if (ret.updatedAt) {
          ret.updatedAt = moment(ret.updatedAt)
            .tz("Asia/Ho_Chi_Minh")
            .format("DD/MM/YYYY");
        }
      },
    },
  },
  {
    collection: "job",
  }
);

const JobModel = mongoose.model("job", Job);
module.exports = JobModel;
