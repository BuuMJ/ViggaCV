const nodemailer = require("nodemailer");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");
class HomeController {
  async home(req, res, next) {
    try {
      const jobs = await JobModel.find({});
      const companies = await CompanyModel.find({});
      const prioritizeJobs = await JobModel.find({ prioritize: true });
      const totalJobs = await JobModel.countDocuments({});
      const topCompanies = await CompanyModel.find()
        .sort({ follow: -1 })
        .limit(4);

      console.log(jobs);

      res.render("home", {
        title: "Vigga Home",
        user: req.user,
        jobs: mutipleMongooseToObject(jobs),
        companies: mutipleMongooseToObject(companies),
        prioritizeJobs: mutipleMongooseToObject(prioritizeJobs),
        topCompanies: mutipleMongooseToObject(topCompanies),
        totalJobs: totalJobs,
      });
    } catch (err) {
      console.log(err);
    }
  }
  //[POST] feedback
  feedback(req, res, next) {
    const feedback = req.body.feedback;
    const user = req.user;
    const mail = user.email;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    if (user != undefined) {
      const mailOptions = {
        from: `"Phản hồi từ khách hàng" <${mail}>`,
        to: "duoc6694@gmail.com", // list of receivers
        subject: "test mail", // Subject line
        html: "Feedback: " + feedback + " from " + user.email, // plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
          res.redirect("back");
        }
      });
    } else {
      res.render("login");
    }
  }
}
module.exports = new HomeController();
