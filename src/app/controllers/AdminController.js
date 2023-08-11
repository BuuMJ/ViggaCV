const { mutipleMongooseToObject } = require("../../util/mongoose");
const CompanyModel = require("../models/Company");
const FavouriteModel = require("../models/Favourite");
const JobModel = require("../models/Job");
const QualifiedModel = require("../models/Qualified");
const RevenueModel = require("../models/Revenua");
const UnsatisfactoryModel = require("../models/Unsatisfactory");
const UserModel = require("../models/User");

class AdminController {
  async admin(req, res, next) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
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
        $match: {
          type: { $in: ["post job", "prioritize"] },
          type: { $ne: "refund" },
        },
      },
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
    const filledMonthlyRevenue = [];
    for (let i = 1; i <= 12; i++) {
      const monthRevenue = monthlyRevenue.find(
        (item) => item._id.year === currentYear && item._id.month === i
      );
      if (monthRevenue) {
        filledMonthlyRevenue.push(monthRevenue);
      } else {
        filledMonthlyRevenue.push({
          _id: { month: i, year: currentYear },
          totalRevenue: 0,
        });
      }
    }

    const currentMonthRevenue = monthlyRevenue.find(
      (item) => item._id.year === currentYear && item._id.month === currentMonth
    );

    // Tổng doanh thu tháng hiện tại
    const totalRevenueCurrentMonth = currentMonthRevenue
      ? currentMonthRevenue.totalRevenue
      : 0;

    //Doanh thu theo quý
    const quarterlyRevenue = await RevenueModel.aggregate([
      {
        $match: {
          type: { $in: ["post job", "prioritize"] },
          type: { $ne: "refund" },
        },
      },
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
    const filledQuarterlyRevenue = [];

    // Vòng lặp qua 4 quý
    for (let i = 1; i <= 4; i++) {
      // Tìm doanh thu của quý hiện tại trong mảng `quarterlyRevenue`
      const revenueOfQuarter = quarterlyRevenue.find(
        (item) => item._id.quarter === i && item._id.year === currentYear
      );

      // Nếu tìm thấy doanh thu, thêm vào mảng kết quả
      if (revenueOfQuarter) {
        filledQuarterlyRevenue.push(revenueOfQuarter);
      } else {
        // Nếu không, thêm một đối tượng với doanh thu bằng 0
        filledQuarterlyRevenue.push({
          _id: { quarter: i, year: currentYear },
          totalRevenue: 0,
        });
      }
    }

    //Doanh thu theo năm
    const annualRevenue = await RevenueModel.aggregate([
      {
        $match: {
          type: { $in: ["post job", "prioritize"] },
          type: { $ne: "refund" },
        },
      },
      {
        $group: {
          _id: { year: { $year: "$createdAt" } },
          totalRevenue: { $sum: "$money" },
        },
      },
    ]).sort({ "_id.year": 1 });

    const revenueSummary = await RevenueModel.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          postJobRevenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "post job"] }, "$money", 0],
            },
          },
          prioritizeRevenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "prioritize"] }, "$money", 0],
            },
          },
          totalRevenue: { $sum: "$money" },
        },
      },
    ]).sort({ "_id.year": 1, "_id.month": 1 });

    const totalRefund = await RevenueModel.aggregate([
      {
        $match: {
          type: "refund",
        },
      },
      {
        $group: {
          _id: null,
          totalRefund: { $sum: "$money" },
        },
      },
    ]);
    const countUser = await UserModel.countDocuments({ role: "user" });
    const countCompany = await UserModel.countDocuments({ role: "company" });

    console.log(countUser);
    console.log(countCompany);
    console.log(totalRefund[0].totalRefund);
    res.render("admin", {
      user: req.user,
      mostJobFavourite: mostFavourite,
      mostJobApplied: jobDetails,
      mostCompanyApplied: companiesWithAppliedCounts,
      monthlyRevenue: filledMonthlyRevenue,
      quarterlyRevenue: filledQuarterlyRevenue,
      annualRevenue,
      company,
      totalRefund: totalRefund[0].totalRefund,
      countUser,
      countCompany,
      revenueSummary,
      totalRevenueCurrentMonth,
    });
  }
}
module.exports = new AdminController();
