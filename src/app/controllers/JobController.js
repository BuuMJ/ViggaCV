const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const FavouriteModel = require("../models/Favourite");
const ViewedModel = require("../models/Viewed");
const QualifiedModel = require("../models/Qualified");
const UnsatisfactoryModel = require("../models/Unsatisfactory");

const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");
const RevenueModel = require("../models/Revenua");

class JobController {
  async job(req, res, next) {
    const user = req.user;
    const job = await JobModel.find({ active: true });
    const count = await JobModel.countDocuments({ active: true });
    const company = await CompanyModel.find({});
    var page = req.query.page;
    var PAGE_SIZE = 10;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }

    const companies = await CompanyModel.find({});

    // Lọc ra các công ty có ít nhất 2 công việc
    const companiesWithAtLeast2Jobs = [];
    for (const company1 of companies) {
      const jobCount = await JobModel.countDocuments({
        iduser: company1.iduser,
        active: true,
      });
      if (jobCount >= 2) {
        companiesWithAtLeast2Jobs.push(company1);
      }
    }

    // Nếu không tìm thấy công ty phù hợp, bạn có thể xử lý tình huống này ở đây
    if (companiesWithAtLeast2Jobs.length === 0) {
      // ...
    }

    // Chọn ngẫu nhiên một công ty từ danh sách công ty phù hợp
    const randomIndex = Math.floor(
      Math.random() * companiesWithAtLeast2Jobs.length
    );
    const randomCompany = companiesWithAtLeast2Jobs[randomIndex];

    // Tìm công việc của công ty được chọn
    const jobs = await JobModel.find({
      iduser: randomCompany.iduser,
      active: true,
    });

    // Lấy ngẫu nhiên 3 công việc
    const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3);

    // In ra kết quả
    // console.log(
    //   "3 công việc ngẫu nhiên của công ty",
    //   randomCompany.companyname,
    //   "là:",
    //   randomJobs
    // );

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

    // console.log(
    //   "đây là công ty có nhiều job nhất trước khi search: " + bestCP.avatar
    // );
    // console.log(
    //   "đây là công ty có nhiều follow nhất trước khi search: " +
    //     bestFL.background
    // );

    if (page) {
      //Get page
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find({ active: true })
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ prioritize: -1, createdAt: -1 })
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
            company: mutipleMongooseToObject(company), //cần sửa company chỗ này
            company1: company,
            jobs: mutipleMongooseToObject(job),
            random: staffMongoseToObject(randomCompany),
            randomJobs: mutipleMongooseToObject(randomJobs),
            listcompany: mutipleMongooseToObject(company),
          });
        });
    } else {
      //Get page
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find({ active: true })
        .skip(skip)
        .limit(PAGE_SIZE)
        .sort({ prioritizeUpdatedAt: -1, createdAt: -1 })
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
            company: mutipleMongooseToObject(company), // cần sửa company chỗ này
            random: staffMongoseToObject(randomCompany),
            jobs: mutipleMongooseToObject(job),
            randomJobs: mutipleMongooseToObject(randomJobs),
            listcompany: mutipleMongooseToObject(company),
            company1: company,
          });
        });
    }
  }

  async search(req, res, next) {
    const allJobs = await JobModel.find({ active: true });
    const user = req.user;
    const search = req.query.search;
    const categories = req.query.categories;
    const position = req.query.position;
    let query = {
      $or: [
        { jobname: { $regex: search, $options: "i" } },
        { companyname: { $regex: search, $options: "i" } },
      ],
      active: true,
    };

    if (categories) {
      query.categories = categories;
    }

    if (position) {
      query.position = position;
    }

    const job = await JobModel.find(query);
    const count = job.length;
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
              iduser: "$iduser",
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

    // console.log(
    //   "đây là công ty có nhiều job nhất sau khi search: " + bestCP.avatar
    // );
    // console.log(
    //   "đây là công ty có nhiều follow nhất sau khi search: " + bestFL.background
    // );
    const randomIndex = Math.floor(Math.random() * company.length);
    const randomCompany = company[randomIndex];
    const jobs = await JobModel.find({
      iduser: randomCompany.iduser,
      active: true,
    });
    const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3);
    if (page) {
      //Get page
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find(query)
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.render("job", {
            user,
            count: count,
            search: search,
            total: total,
            pages: pages,
            title: "List Job",
            jobs: mutipleMongooseToObject(allJobs),
            job: mutipleMongooseToObject(data),
            bestCP: staffMongoseToObject(bestCP),
            bestFL: staffMongoseToObject(bestFL),
            company: mutipleMongooseToObject(company), // cần sửa company chỗ này
            random: staffMongoseToObject(randomCompany),
            randomJobs: mutipleMongooseToObject(randomJobs),
            company1: company,
            listcompany: mutipleMongooseToObject(company),
          });
        });
    } else {
      //Get page
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;

      JobModel.find(query)
        .skip(skip)
        .limit(PAGE_SIZE)
        .then((data) => {
          res.render("job", {
            user,
            count: count,
            search: search,
            total: total,
            pages: pages,
            title: "List Job",
            jobs: mutipleMongooseToObject(allJobs),
            job: mutipleMongooseToObject(data),
            bestCP: staffMongoseToObject(bestCP),
            bestFL: staffMongoseToObject(bestFL),
            company: mutipleMongooseToObject(company), //cần sửa company chỗ này
            random: staffMongoseToObject(randomCompany),
            randomJobs: mutipleMongooseToObject(randomJobs),
            listcompany: mutipleMongooseToObject(company),
            company1: company,
          });
        });
    }
  }

  async scan(req, res, next) {
    const user = req.user;
    const allJobs = await JobModel.find({ active: true });

    if (req.session.jobs) {
      var search = req.session.jobs;
      var job = await JobModel.find({
        active: true,
        jobrequi: { $regex: new RegExp(req.session.jobs.join("|"), "i") },
      });
      // console.log(job);
    }

    if (req.session.companyfield) {
      var search = req.session.companyfield;
      var companies = await CompanyModel.find({
        companyfield: {
          $regex: new RegExp(req.session.companyfield.join("|"), "i"),
        },
      }).select("_id");
      const companyIDs = companies.map((company) => company._id);
      var companyscan = { ids: companyIDs };
      // console.log(company);
      var job = await JobModel.find({
        idcompany: { $in: companyscan.ids },
        active: true,
      });
      // console.log("đây là sanh sách các công việc phù hợp với bạn: " + job);
    }
    const count = job.length;
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
              iduser: "$iduser",
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

    // console.log(
    //   "đây là công ty có nhiều job nhất sau khi search: " + bestCP.avatar
    // );
    // console.log(
    //   "đây là công ty có nhiều follow nhất sau khi search: " + bestFL.background
    // );
    const randomIndex = Math.floor(Math.random() * company.length);
    const randomCompany = company[randomIndex];
    const jobs = await JobModel.find({
      iduser: randomCompany.iduser,
      active: true,
    });
    const randomJobs = jobs.sort(() => 0.5 - Math.random()).slice(0, 3);

    if (page) {
      //Get page
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;

      if (req.session.jobs) {
        JobModel.find({
          active: true,
          jobrequi: { $regex: new RegExp(req.session.jobs.join("|"), "i") },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            delete req.session.jobs;
            res.render("job", {
              user,
              count: count,
              search: search,
              total: total,
              pages: pages,
              title: "List Job",
              jobs: mutipleMongooseToObject(allJobs),
              job: mutipleMongooseToObject(data),
              bestCP: staffMongoseToObject(bestCP),
              bestFL: staffMongoseToObject(bestFL),
              company: mutipleMongooseToObject(company), //cần sửa company chỗ này
              random: staffMongoseToObject(randomCompany),
              randomJobs: mutipleMongooseToObject(randomJobs),
              listcompany: mutipleMongooseToObject(company),
              company1: company,
            });
          });
      }
      if (req.session.companyfield) {
        JobModel.find({ idcompany: { $in: companyscan.ids }, active: true })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            delete req.session.companyfield;
            res.render("job", {
              user,
              count: count,
              search: search,
              total: total,
              pages: pages,
              title: "List Job",
              jobs: mutipleMongooseToObject(allJobs),
              job: mutipleMongooseToObject(data),
              bestCP: staffMongoseToObject(bestCP),
              bestFL: staffMongoseToObject(bestFL),
              company: mutipleMongooseToObject(company), //cần sửa company chỗ này
              random: staffMongoseToObject(randomCompany),
              randomJobs: mutipleMongooseToObject(randomJobs),
              listcompany: mutipleMongooseToObject(company),
              company1: company,
            });
          });
      }
    } else {
      //Get page
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;

      if (req.session.jobs) {
        JobModel.find({
          active: true,
          jobrequi: { $regex: new RegExp(req.session.jobs.join("|"), "i") },
        })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            delete req.session.jobs;
            res.render("job", {
              user,
              count: count,
              search: search,
              total: total,
              pages: pages,
              title: "List Job",
              jobs: mutipleMongooseToObject(allJobs),
              job: mutipleMongooseToObject(data),
              bestCP: staffMongoseToObject(bestCP),
              bestFL: staffMongoseToObject(bestFL),
              company: mutipleMongooseToObject(company), //cần sửa company chỗ này
              random: staffMongoseToObject(randomCompany),
              randomJobs: mutipleMongooseToObject(randomJobs),
              listcompany: mutipleMongooseToObject(company),
              company1: company,
            });
          });
      }
      if (req.session.companyfield) {
        JobModel.find({ active: true, idcompany: { $in: companyscan.ids } })
          .skip(skip)
          .limit(PAGE_SIZE)
          .then((data) => {
            delete req.session.companyfield;
            res.render("job", {
              user,
              count: count,
              search: search,
              total: total,
              pages: pages,
              title: "List Job",
              jobs: mutipleMongooseToObject(allJobs),
              job: mutipleMongooseToObject(data),
              bestCP: staffMongoseToObject(bestCP),
              bestFL: staffMongoseToObject(bestFL),
              company: mutipleMongooseToObject(company), //cần sửa company chỗ này
              random: staffMongoseToObject(randomCompany),
              randomJobs: mutipleMongooseToObject(randomJobs),
              listcompany: mutipleMongooseToObject(company),
              company1: company,
            });
          });
      }
    }
  }

  //[GET] Job Detail
  async detail(req, res, next) {
    try {
      if (req.user) {
        var user = req.user;
      } else {
        var user = null;
      }
      const idjob = req.params.id;

      if (req.user) {
        const viewed = await ViewedModel.findOne({
          userid: user._id,
          jobid: idjob,
        });
        if (viewed) {
          await ViewedModel.findByIdAndUpdate(viewed._id, {});
        } else {
          await ViewedModel.create({
            userid: user._id,
            jobid: idjob,
          });
        }
        const favourite = await FavouriteModel.findOne({
          jobid: idjob,
          userid: user._id,
        });
        if (favourite) {
          var checksave = 2;
        } else {
          var checksave = undefined;
        }
      } else {
        var checksave = undefined;
      }
      const detail = await JobModel.findOne({ _id: idjob, active: true });
      const company = await CompanyModel.findOne({ iduser: detail.iduser });
      const job = await JobModel.find({ iduser: detail.iduser, active: true });
      res.render("jobdetail", {
        title: "Job Detail",
        detail: staffMongoseToObject(detail),
        user: req.user,
        checksave,
        company: staffMongoseToObject(company), //cần sửa company chỗ này
        job: mutipleMongooseToObject(job),
      });
    } catch (err) {
      console.log(err);
    }
  }

  async favourite(req, res, next) {
    const iduser = req.user._id;
    const idjob = req.query.id;
    console.log(idjob);
    const checkFR = await FavouriteModel.findOne({
      userid: iduser,
      jobid: idjob,
    });
    console.log("da toi trang yeu thich job");
    if (checkFR) {
      await FavouriteModel.findByIdAndRemove(checkFR._id);
      console.log("Đã xoá khỏi công việc yêu thích ");
      res.redirect("back");
    } else {
      const action = new FavouriteModel({
        userid: iduser,
        jobid: idjob,
      });
      await action.save();
      console.log("Đã lưu công việc yêu thích ");

      res.redirect("back");
    }
  }

  async job_favourite(req, res, next) {
    const iduser = req.user._id;
    // Lấy danh sách job yêu thích của user từ bảng favourite
    const favouriteJobs = await FavouriteModel.find({ userid: iduser });

    // Lấy danh sách jobID từ kết quả truy vấn trước
    const favouriteJobIds = favouriteJobs.map((fav) => fav.jobid);

    const favouriteJobIdsAsString = favouriteJobIds.map((id) => id.toString());

    const apply1 = await QualifiedModel.find({ userid: iduser }).distinct(
      "jobid"
    );
    const apply2 = await UnsatisfactoryModel.find({ userid: iduser }).distinct(
      "jobid"
    );
    const merged = apply1.concat(apply2);
    const uniqueMerged = Array.from(new Set(merged));
    const listapply = await JobModel.find({
      _id: { $in: uniqueMerged },
      active: true,
    });
    const applyWithFlag = listapply.map((job) => ({
      ...job.toObject(),
      isFavourite: favouriteJobIdsAsString.includes(job._id.toString()),
    }));
    const countApply = await JobModel.countDocuments({
      _id: { $in: uniqueMerged },
      active: true,
    });
    const jobs = await FavouriteModel.find({ userid: iduser }).distinct(
      "jobid"
    );
    const viewed = await ViewedModel.find({
      userid: iduser,
    }).distinct("jobid");
    const listViewed = await JobModel.find({
      active: true,
      _id: { $in: viewed },
    });
    const viewWithFlag = listViewed.map((job) => ({
      ...job.toObject(),
      isFavourite: favouriteJobIdsAsString.includes(job._id.toString()),
    }));
    const countViewed = await JobModel.countDocuments({
      _id: { $in: viewed },
      active: true,
    });
    const listjob = await JobModel.find({
      _id: { $in: jobs },
    });
    const count = await JobModel.countDocuments({
      _id: { $in: jobs },
      active: true,
    });
    const userid = req.user._id;
    const revenue = await FavouriteModel.find({ userid: userid });
    const result = await FavouriteModel.aggregate([
      {
        $match: { userid: userid },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "jobid",
          foreignField: "_id",
          as: "jobInfo",
        },
      },
      {
        $unwind: "$jobInfo",
      },
      {
        $group: {
          _id: "$jobInfo._id",
          jobData: { $push: "$jobInfo" },
        },
      },
    ]);
    console.log(result);
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    res.render("job_favourite", {
      company,
      listjob: mutipleMongooseToObject(listjob),
      listViewed: viewWithFlag,
      listApply: applyWithFlag,
      user: req.user,
      count,
      countViewed,
      countApply,
    });
  }
}

module.exports = new JobController();
