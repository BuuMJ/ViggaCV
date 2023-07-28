const nodemailer = require("nodemailer");
const JobModel = require("../models/Job");
const CompanyModel = require("../models/Company");

class HomeController {
  home(req, res, next) {
    JobModel.find({}, function (err, jobs) {
      if (err) {
        console.log(err);
      } else {
        CompanyModel.find({}, function (err, companies) {
          if (err) {
            console.log(err);
          } else {
            JobModel.find({ prioritize: true }, function (err, prioritizeJobs) {
              if (err) {
                console.log(err);
              } else {
                res.render("home", {
                  title: "Vigga Home",
                  user: req.user,
                  jobs: jobs,
                  companies: companies,
                  prioritizeJobs: prioritizeJobs,
                });
              }
            });
          }
        });
      }
    });
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
