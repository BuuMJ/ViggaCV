const nodemailer = require("nodemailer");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");
const SubscribeModel = require("../models/Subscribe");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");
class HomeController {
  async home(req, res, next) {
    try {
      const jobs = await JobModel.find({});
      // thêm chức năng 20 việc làm mới nhất + thêm tổng số count vào
      const companies = await CompanyModel.find({});
      // thêm chức năng công ty có nhiều công việc nhất
      const prioritizeJobs = await JobModel.find({ prioritize: true }); // công việc giá trị cao
      const totalJobs = await JobModel.countDocuments({});
      const latestJobs = await JobModel.find()
        .sort({ createdAt: -1 })
        .limit(20);
      const mostJobs = await CompanyModel.find()
        .sort({ jobcount: -1 })
        .limit(5);
      const topCompanies = await CompanyModel.find() // công ty có nhiều follow
        .sort({ follow: -1 })
        .limit(4);
      res.render("home", {
        title: "Vigga Home",
        user: req.user,
        jobs: mutipleMongooseToObject(jobs),
        companies: mutipleMongooseToObject(companies),
        prioritizeJobs: mutipleMongooseToObject(prioritizeJobs),
        topCompanies: mutipleMongooseToObject(topCompanies),
        latestJobs: mutipleMongooseToObject(latestJobs),
        totalJobs: totalJobs,
        mostJobs: mutipleMongooseToObject(mostJobs),
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

  async subscribe(req, res, next) {
    const email = req.body.subscribe;
    const data = await SubscribeModel.findOne({ email: email });
    console.log("đã tới đây1" + email);
    if (email != "") {
      if (data) {
        console.log("đã tới đây2");

        req.session.msg = "Địa chỉ email của bạn đã đăng ký thành công!";
        res.redirect("/");
      } else {
        console.log("đã tới đây3");

        await SubscribeModel.create({
          email: email,
        });
        req.session.msg = "Địa chỉ email của bạn đã đăng ký thành công!";
        res.redirect("/");
      }
    } else {
      console.log("đã tới đây4");

      req.session.msg = "Vui lòng nhập địa chỉ email của bạn!";
      res.redirect("/");
    }
  }
}
module.exports = new HomeController();
