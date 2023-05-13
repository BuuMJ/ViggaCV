const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");

class JobController {
  async job(req, res, next) {
    const user = req.user;
    const job = await JobModel.find({});
    const count = await JobModel.countDocuments()
    const company = await CompanyModel.find({});
    res.render("job", {
      title: "List Job",
      job: mutipleMongooseToObject(job),
      company: mutipleMongooseToObject(company),
      user,
      count: count,
    });
  }

  //[GET] Job Detail
  async detail(req, res, next) {
    try {const user = req.user;
      const idjob = req.params.id;
      const detail = await JobModel.findOne({ _id: idjob });
      const company = await CompanyModel.findOne({iduser: detail.iduser})
      const job = await JobModel.find({iduser: detail.iduser})
      console.log(job + 'asdasdgjahgsjhagsfhagjdhgajsdajgajsg')
      res.render("jobdetail", {
        title: "Job Detail",
        detail: staffMongoseToObject(detail),
        user,
        company: staffMongoseToObject(company),
        job: mutipleMongooseToObject(job),
      });
    }catch(err){
      console.log(err)
    }
  }
}

module.exports = new JobController();
