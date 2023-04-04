const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");

class JobController {
  async job(req, res, next) {
    const job = await JobModel.find({});
    const company = await CompanyModel.find({});
    res.render("job", {
      title: "List Job",
      job: mutipleMongooseToObject(job),
      company: mutipleMongooseToObject(company),
    });
  }

  async detail(req, res, next) {
    const idjob = req.params.id;
    const detail = await JobModel.findOne({ _id: idjob });
    res.render("jobdetail", {
      title: "Job Detail",
      detail: staffMongoseToObject(detail),
    });
  }
}

module.exports = new JobController();
