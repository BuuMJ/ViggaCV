const { mutipleMongooseToObject } = require("../../util/mongoose");
const CompanyModel = require("../models/Company");
const FavouriteModel = require("../models/Favourite");
const JobModel = require("../models/Job");
const QualifiedModel = require("../models/Qualified");
const RevenueModel = require("../models/Revenua");
const UnsatisfactoryModel = require("../models/Unsatisfactory");

class AdminController {
  async admin(req, res, next) {
    const user = req.user;
    const company = await CompanyModel.findOne({ iduser: user._id });
    //Công việc nhiều theo dõi nhất
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

    // Công việc nhiều apply nhất
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

    // Công ty có nhiều apply nhất
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

    //Doanh thu theo tháng
    const monthlyRevenue = await RevenueModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$money" },
        },
      },
    ]).sort({ "_id.year": 1, "_id.month": 1 });

    //Doanh thu theo quý
    const quarterlyRevenue = await RevenueModel.aggregate([
      {
        $group: {
          _id: {
            quarter: { $ceil: { $divide: [{ $month: "$createdAt" }, 3] } },
            year: { $year: "$createdAt" },
          },
          totalRevenue: { $sum: "$money" },
        },
      },
    ]).sort({ "_id.year": 1, "_id.quarter": 1 });

    //Doanh thu theo năm
    const annualRevenue = await RevenueModel.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$money" },
        },
      },
    ]).sort({ "_id.year": 1 });
    console.log(monthlyRevenue);
    console.log(quarterlyRevenue);
    console.log(annualRevenue);
    res.render("admin", {
      user: req.user,
      mostJobFavourite: mostFavourite,
      mostJobApplied: jobDetails,
      mostCompanyApplied: companiesWithAppliedCounts,
      monthlyRevenue,
      quarterlyRevenue,
      annualRevenue,
      company,
    });
  }
}
module.exports = new AdminController();
