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

    //tìm số job cao nhất
    const highest = await JobModel.aggregate([
      {
        $group: {
          _id: "$companyname",
          job_count: { $sum: 1 },
          iduser: { $first: "$iduser" },
        },
      },
      {
        $sort: {
          job_count: -1,
        },
      },
      {
        $limit: 1,
      },
    ]);
    //tìm công ty có số job cao nhất

    if (highest[0]) {
      var bestCP = await CompanyModel.findOne({ iduser: highest[0].iduser });
    } else {
      var bestCP = null;
    }

    //tìm số follow cao nhất
    const mostFL = await CompanyModel.aggregate([
      {
        $group: {
          _id: null,
          companies: {
            $push: {
              _id: "$_id",
              iduser: "$iduser", // Thêm trường iduser vào đối tượng company
              companyname: "$companyname",
              follow: "$follow",
            },
          },
          max_follow: { $max: "$follow" },
        },
      },
      {
        $project: {
          _id: 0,
          companies: {
            $filter: {
              input: "$companies",
              as: "company",
              cond: { $eq: ["$$company.follow", "$max_follow"] },
            },
          },
        },
      },
      {
        $limit: 1, // Giới hạn kết quả trả về là 1
      },
    ]);
    if (mostFL) {
      var bestFL = await CompanyModel.findOne({
        iduser: mostFL[0].companies[0].iduser,
      });
    } else {
      var bestFL = null;
    }

    if (page) {
      //Get page
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find({})
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.render("job", {
            user,
            count: count,
            total: total,
            pages: pages,
            title: "List Job",
            job: mutipleMongooseToObject(data),
            bestCP: staffMongoseToObject(bestCP),
            bestFL: staffMongoseToObject(bestFL),
            company: mutipleMongooseToObject(company),
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
            user,
            count: count,
            total: total,
            pages: pages,
            title: "List Job",
            job: mutipleMongooseToObject(data),
            bestCP: staffMongoseToObject(bestCP),
            bestFL: staffMongoseToObject(bestFL),
            company: mutipleMongooseToObject(company),
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