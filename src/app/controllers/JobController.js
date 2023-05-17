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
    const count = await JobModel.countDocuments();
    const company = await CompanyModel.find({});
    var page = req.query.page;
    var PAGE_SIZE = 10;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    console.log("đây là tổng số trang cần có = " + total);
    if (page) {
      //Get page
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.render("job", {
            title: "List Job",
            job: mutipleMongooseToObject(data),
            company: mutipleMongooseToObject(company),
            user,
            count: count,
            total: total,
            pages: pages,
          });
        });
    } else {
      //Get page
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.render("job", {
            title: "List Job",
            job: mutipleMongooseToObject(data),
            company: mutipleMongooseToObject(company),
            user,
            count: count,
            pages: pages,
            total: total,
          });
        });
    }
  }

  //[GET] Job Detail
  async detail(req, res, next) {
    try {
      const user = req.user;
      const idjob = req.params.id;
      const detail = await JobModel.findOne({ _id: idjob });
      const company = await CompanyModel.findOne({ iduser: detail.iduser });
      const job = await JobModel.find({ iduser: detail.iduser });
      console.log(job + "asdasdgjahgsjhagsfhagjdhgajsdajgajsg");
      res.render("jobdetail", {
        title: "Job Detail",
        detail: staffMongoseToObject(detail),
        user,
        company: staffMongoseToObject(company),
        job: mutipleMongooseToObject(job),
      });
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new JobController();