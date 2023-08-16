const {
  mutipleMongooseToObject,
  mutipleJobToJSON,
} = require("../../util/mongoose");
const CompanyModel = require("../models/Company");
const FavouriteModel = require("../models/Favourite");
const JobModel = require("../models/Job");
const QualifiedModel = require("../models/Qualified");
const RevenueModel = require("../models/Revenua");
const UnsatisfactoryModel = require("../models/Unsatisfactory");
const nodemailer = require("nodemailer");
const UserModel = require("../models/User");
const bcrypt = require("bcrypt");

class AdminController {
  async admin(req, res, next) {
    const msg = req.query.message;
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
    const jobCount = await JobModel.countDocuments();
    const lockedJob = await JobModel.find({ active: false });
    const lockedJobCount = await JobModel.countDocuments({ active: false });
    const prioritizeJob = await JobModel.find({ prioritize: true });
    const jobHighSalary = await JobModel.find({
      salary: { $gte: 4000 },
    });
    const favouriteJobs = await FavouriteModel.aggregate([
      {
        $group: {
          _id: "$jobid",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "jobs",
          localField: "_id",
          foreignField: "_id",
          as: "jobDetail",
        },
      },
      {
        $unwind: "$jobDetail",
      },
    ]);

    var count = await UserModel.countDocuments({
      role: { $in: ["user", "company"] },
    });
    var page = req.query.page;
    var PAGE_SIZE = 8;
    var total = Math.ceil(count / PAGE_SIZE);
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    if (page) {
      page = parseInt(page);
      var skip = (page - 1) * PAGE_SIZE;
      var listUser = await UserModel.find({
        role: { $in: ["user", "company"] },
      })
        .skip(skip)
        .limit(PAGE_SIZE);
    } else {
      page = 1;
      var skip = (page - 1) * PAGE_SIZE;
      var listUser = await UserModel.find({
        role: { $in: ["user", "company"] },
      })
        .skip(skip)
        .limit(PAGE_SIZE);
    }

    var pageListJob = req.query.pageJob;
    var totalPageJob = Math.ceil(jobCount / PAGE_SIZE);
    const pageJob = [];
    for (let i = 1; i <= totalPageJob; i++) {
      pageJob.push(i);
    }
    if (pageListJob) {
      pageListJob = parseInt(pageListJob);
      var skip = (pageListJob - 1) * PAGE_SIZE;
      var listJob = await JobModel.find().skip(skip).limit(PAGE_SIZE);
    } else {
      pageListJob = 1;
      var skip = (pageListJob - 1) * PAGE_SIZE;
      var listJob = await JobModel.find().skip(skip).limit(PAGE_SIZE);
    }

    const countPostJob = await JobModel.countDocuments({
      $and: [{ salary: { $gte: 4000 } }, { salary: { $ne: "Negotiable" } }],
    });
    const countPrioritize = await JobModel.countDocuments({
      prioritize: true,
    });
    //người gửi yêu câu, số tiền, ngày gửi yêu cầu
    const listJobRequestPrioritize = await JobModel.aggregate([
      {
        $match: {
          request: { $in: ["prioritize", "all"] },
        },
      },
      {
        $addFields: {
          idcompany: { $toObjectId: "$idcompany" },
        },
      },
      {
        $lookup: {
          from: "revenues",
          localField: "_id",
          foreignField: "idjob",
          pipeline: [
            {
              $match: {
                type: "prioritize",
              },
            },
          ],
          as: "revenueDetail",
        },
      },
      {
        $lookup: {
          from: "company",
          localField: "idcompany",
          foreignField: "_id",
          as: "companyDetail",
        },
      },
      {
        $unwind: "$revenueDetail",
      },
      {
        $unwind: "$companyDetail",
      },
    ]);

    const listJobRequestPostJob = await JobModel.aggregate([
      {
        $match: {
          request: { $in: ["post job", "all"] },
        },
      },
      {
        $addFields: {
          idcompany: { $toObjectId: "$idcompany" },
        },
      },
      {
        $lookup: {
          from: "revenues",
          localField: "_id",
          foreignField: "idjob",
          pipeline: [
            {
              $match: {
                type: "post job",
              },
            },
          ],
          as: "revenueDetail",
        },
      },
      {
        $lookup: {
          from: "company",
          localField: "idcompany",
          foreignField: "_id",
          as: "companyDetail",
        },
      },
      {
        $unwind: "$revenueDetail",
      },
      {
        $unwind: "$companyDetail",
      },
    ]);
    const refundCount = await RevenueModel.countDocuments({ type: "refund" });
    var pageListRefund = req.query.pageRefund;
    var totalPageRefund = Math.ceil(refundCount / PAGE_SIZE);
    const pageRefund = [];
    for (let i = 1; i <= totalPageRefund; i++) {
      pageRefund.push(i);
    }
    if (pageListRefund) {
      pageListRefund = parseInt(pageListRefund);
      var limit = pageListRefund * PAGE_SIZE;
      var listRefund = await RevenueModel.find({ type: "refund" })
        .populate({ path: "iduser", select: "fullname", model: "user" })
        .populate({
          path: "idcompany",
          select: "companyname avatar",
          model: "company",
        })
        .select("money type jobname updatedAt admin")
        .limit(limit);
    } else {
      pageListRefund = 1;
      var limit = pageListRefund * PAGE_SIZE;
      var listRefund = await RevenueModel.find({ type: "refund" })
        .populate({ path: "iduser", select: "fullname", model: "user" })
        .populate({
          path: "idcompany",
          select: "companyname avatar",
          model: "company",
        })
        .select("money type jobname updatedAt admin")
        .limit(limit);
    }
    const revenueCount = await await RevenueModel.countDocuments({
      type: { $in: ["post job", "prioritize"] },
    });
    var pageListRevenue = req.query.pageRevenue;
    var totalPageRevenue = Math.ceil(revenueCount / PAGE_SIZE);
    const pageRevenue = [];
    for (let i = 1; i <= totalPageRevenue; i++) {
      pageRevenue.push(i);
    }
    if (pageListRevenue) {
      pageListRevenue = parseInt(pageListRevenue);
      var limit = pageListRevenue * PAGE_SIZE;
      var listRevenue = await RevenueModel.find({
        type: { $in: ["post job", "prioritize"] },
      })
        .populate({ path: "iduser", select: "fullname", model: "user" })
        .populate({
          path: "idcompany",
          select: "companyname avatar",
          model: "company",
        })
        .select("money type jobname updatedAt admin")
        .limit(limit);
    } else {
      pageListRevenue = 1;
      var limit = pageListRevenue * PAGE_SIZE;
      var listRevenue = await RevenueModel.find({
        type: { $in: ["post job", "prioritize"] },
      })
        .populate({ path: "iduser", select: "fullname", model: "user" })
        .populate({
          path: "idcompany",
          select: "companyname avatar",
          model: "company",
        })
        .select("money type jobname updatedAt admin")
        .limit(limit);
    }

    console.log(pageRevenue);
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
      jobCount,
      pages,
      listUser: mutipleMongooseToObject(listUser),
      listJob: mutipleJobToJSON(listJob),
      lockedJobCount,
      lockedJob: mutipleJobToJSON(lockedJob), // danh sách các công việc bị khoá
      prioritizeJob: mutipleJobToJSON(prioritizeJob), // danh sách công việc được quảng cáo
      jobHighSalary: mutipleJobToJSON(jobHighSalary), // danh sách công việc lương trên 4000$
      favouriteJobs, // danh sách công việc yêu thích
      countPostJob, // số công việc lươn trên 4000$
      countPrioritize, // số công việc quảng cáo
      pageListJob, // phân trang list job
      listJobRequestPostJob, // danh sách công việc yêu cầu refund post job
      listJobRequestPrioritize, //danh sách công việc yêu cầu refund quảng cáo job
      listRefund: mutipleJobToJSON(listRefund), // danh sách công việc đã refund thành công
      listRevenue: mutipleJobToJSON(listRevenue),
      pageJob,
      pageRefund,
      pageRevenue,
      msg,
    });
  }

  async deleteUser(req, res, next) {
    const idUser = req.params.id;
    await UserModel.findByIdAndDelete(idUser);
    res.redirect("/admin?message=Delete user successful");
  }

  async updateUser(req, res, next) {
    console.log("đã tới trang chỉnh sửa user");
    const idUser = req.params.id;
    const checkEmail = await UserModel.findOne({
      email: req.body.email,
      _id: { $ne: idUser },
    });
    const checkPhone = await UserModel.findOne({
      phone: req.body.phone,
      _id: { $ne: idUser },
    });
    if (checkEmail || checkPhone) {
      return res.redirect(
        "/admin?message=phone number or email already in use"
      );
    } else {
      if (req.body.password) {
        console.log("có password");
        const password = req.body.password;
        const hash = await bcrypt.hash(password, 10);
        await UserModel.findByIdAndUpdate(idUser, {
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
          password: hash,
        });
      } else {
        await UserModel.findByIdAndUpdate(idUser, {
          fullname: req.body.fullname,
          email: req.body.email,
          phone: req.body.phone,
        });
      }
    }
    await UserModel.findByIdAndUpdate(idUser, req.body);
    res.redirect("/admin?message=Update user successful");
  }

  async deleteJob(req, res, next) {
    const idJob = req.params.id;
    await JobModel.findByIdAndDelete(idJob);
    res.redirect("/admin?message=Delete job successful");
  }

  async denyRefund(req, res, next) {
    const idJob = req.params.id;
    await JobModel.findByIdAndUpdate(idJob, {
      active: true,
      request: "non",
    });
    const job = await JobModel.findById(idJob);
    const user = await UserModel.findById(job.iduser);
    console.log(user.email);
    const reason = req.body.reason;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const mailOptions = {
      to: user.email,
      subject: "Refund Notification ",
      html: `
              <html>
                <head>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                      line-height: 1.6;
                      color: #333;
                    }
                    h1 {
                      color: #fed200;
                    }
                    .message {
                      background-color: #f9f9f9;
                      padding: 15px;
                      border-radius: 5px;
                    }
                    .cta-button {
                      display: inline-block;
                      background-color: #0066cc;
                      color: #fff;
                      text-decoration: none;
                      padding: 10px 15px;
                      border-radius: 3px;
                    }
                    .cta-button:hover {
                      background-color: #004c99;
                    }
                  </style>
                </head>
                <body>
                  <h1>ViggaCareers</h1>
                  <div class="message">
                <p>Hello,</p>
                     <p>We're sorry, your refund request was denied.</p>
                     <p>We refuse to request a refund for the following reason: ${reason}.</p>
                     <p>If you have any questions, please reply to this email.</p>
                  </div>
                </body>
              </html>
            `,
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Đã gửi mail cho người post job");
        res.redirect("back");
      }
    });
  }
}
module.exports = new AdminController();
