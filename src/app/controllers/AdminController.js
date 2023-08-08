const { mutipleMongooseToObject } = require("../../util/mongoose");
const CompanyModel = require("../models/Company");
const FavouriteModel = require("../models/Favourite");
const JobModel = require("../models/Job");
const QualifiedModel = require("../models/Qualified");
const UnsatisfactoryModel = require("../models/Unsatisfactory");

class AdminController {
  async admin(req, res, next) {
    const user = req.user;
    const mostFavourite = await FavouriteModel.aggregate([
      {
        $group: {
          _id: "$jobid",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetail",
        },
      },
      //   { $limit: 1 },
    ]);

    const mostQualified = await QualifiedModel.aggregate([
      {
        $group: {
          _id: "$jobid",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);
    const mostUnsatisfactory = await UnsatisfactoryModel.aggregate([
      {
        $group: {
          _id: "$jobid",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const jobCounts = {};
    mostQualified.concat(mostUnsatisfactory).forEach((item) => {
      jobCounts[item._id] = (jobCounts[item._id] || 0) + item.count;
    });
    const mostAppliedJobs = Object.entries(jobCounts)
      .map(([jobid, count]) => ({ jobid, count }))
      .sort((a, b) => b.count - a.count);

    const jobDetails = await Promise.all(
      mostAppliedJobs.map(async (item) => {
        const jobDetail = await JobModel.findOne({ _id: item.jobid });
        return {
          ...item,
          jobDetail,
        };
      })
    );

    const companyCounts = {};
    jobDetails.forEach((item) => {
      const idcompany = item.jobDetail.idcompany;
      companyCounts[idcompany] = (companyCounts[idcompany] || 0) + item.count;
    });

    const companiesWithAppliedCounts = await Promise.all(
      Object.entries(companyCounts).map(async ([idcompany, count]) => {
        const companyDetail = await CompanyModel.findOne({ _id: idcompany });
        return {
          ...companyDetail.toObject(),
          count,
        };
      })
    );
    companiesWithAppliedCounts.sort((a, b) => b.count - a.count);

    console.log(companiesWithAppliedCounts);
    const company = await CompanyModel.findOne({ iduser: user._id });
    res.render("admin", {
      user: req.user,
      mostFavourite,
      mostApplied: jobDetails,
      company,
    });
  }
}
module.exports = new AdminController();
