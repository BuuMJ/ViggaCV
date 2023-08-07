const paypal = require("paypal-rest-sdk");
const JobModel = require("../models/Job");
const moment = require("moment-timezone");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");
const { job } = require("./JobController");
const SubscribeModel = require("../models/Subscribe");
const CompanyModel = require("../models/Company");
const ActionModel = require("../models/Action");
const UserModel = require("../models/User");
const nodemailer = require("nodemailer");

class PaymentController {
  pay(req, res, next) {
    const price = 1.5;
    if (req.body.paymentday) {
      var days = req.body.paymentday;
    } else {
      var days = 30;
    }
    req.session.days = days;
    req.session.total = price * days;
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/pay/success",
        cancel_url: "http://localhost:3000/pay/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "job advertisement",
                sku: "001",
                price: price * days,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: price * days,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }
  async success(req, res, next) {
    const jobID = req.session.jobID;
    const total = req.session.total;
    const days = req.session.days;
    const jobsuccess = await JobModel.findById(jobID);
    var payerID = req.query.PayerID;
    var execute_payment_json = {
      payer_id: payerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: total,
          },
        },
      ],
    };

    var paymentId = req.query.paymentId;
    const company = await CompanyModel.findOne({ iduser: req.user._id });

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          try {
            console.log("đã tới đây");
            let job = await JobModel.findById(jobID);
            job.prioritize = true;
            job.prioritizeUpdatedAt = moment().add(days, "days").toDate();
            await job.save();
            console.log(job.prioritize);
          } catch (err) {
            console.log(err);
          }
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("confirm", {
            jobID: jobID,
            job: staffMongoseToObject(jobsuccess),
            user: req.user,
            days: req.session.days,
            company,
          });
        }
      }
    );
  }

  async cancel(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    const jobID = "646b3b9912eaed3af0ede0ff";
    const job = await JobModel.findById({ _id: jobID });
    res.render("cancel", {
      user: req.user,
      job: staffMongoseToObject(job),
      company,
    });
  }

  async check(req, res, next) {
    const company = await CompanyModel.findOne({ iduser: req.user._id });
    const jobID = req.params.id;
    req.session.jobID = jobID;
    const job = await JobModel.findById({ _id: jobID });
    if (job.prioritize == false) {
      // res.redirect("/pay");
      res.render("check", {
        user: req.user,
        job: staffMongoseToObject(job),
        company,
      });
    } else {
      res.redirect("back");
    }
  }

  payjob(req, res, next) {
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:3000/pay/successjob",
        cancel_url: "http://localhost:3000/pay/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "higher level job",
                sku: "002",
                price: 30,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: 30,
          },
          description: "This is the payment description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        console.log("Create Payment Response");
        console.log(payment);
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  }

  async successjob(req, res, next) {
    const user = req.user;
    var payerID = req.query.PayerID;
    var execute_payment_json = {
      payer_id: payerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: 30,
          },
        },
      ],
    };

    var paymentId = req.query.paymentId;
    const company = await CompanyModel.findOne({ iduser: req.user._id });

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          try {
            const jobData = req.session.jobData;
            const iduser = jobData.iduser;
            const jobname = jobData.jobname;
            const jobdesc = jobData.jobdesc;
            const jobrequi = jobData.jobrequi;
            const salary = jobData.salary;
            const joblocation = jobData.joblocation;
            const benefit = jobData.benefit;
            const position = jobData.position;
            const DoP = jobData.DoP;
            const subscribes = await SubscribeModel.find().distinct("email");
            const companyname = await CompanyModel.findOne({ iduser: iduser });
            const companyfollow = await ActionModel.find({
              companyid: companyname._id,
            }).distinct("userid");
            const listEmail = await UserModel.find({
              _id: { $in: companyfollow },
            }).distinct("email");
            const combinedEmails = subscribes.concat(listEmail);
            const oldjob = await JobModel.findOne({
              iduser: iduser,
              DoP: DoP,
              benefit: benefit,
              companyname: companyname.companyname,
              categories: companyname.companyfield,
              jobname: jobname,
              jobdesc: jobdesc,
              salary: salary,
              jobrequi: jobrequi,
              position: position,
              joblocation: joblocation,
              avatar: companyname.avatar,
              idcompany: companyname._id,
            });
            if (oldjob) {
              var job = new JobModel({
                iduser: iduser,
                DoP: DoP,
                benefit: benefit,
                companyname: companyname.companyname,
                categories: companyname.companyfield,
                jobname: jobname,
                jobdesc: jobdesc,
                salary: salary,
                jobrequi: jobrequi,
                position: position,
                joblocation: joblocation,
                avatar: companyname.avatar,
                idcompany: companyname._id,
              });
              if (job) {
                if (combinedEmails.length > 0) {
                  var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "duoc6694@gmail.com",
                      pass: "wdymtvgbhblstfbj",
                    },
                  });
                  const linkJob = `http://localhost:3000/job/${job._id}`;
                  const mailOptions = {
                    to: combinedEmails, // list of receivers
                    subject: "ViggaCareers ", // Subject line<a href="${linkJob}">here</a>
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
            color: #0066cc;
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
          <p>Có một việc làm mới đã được đăng bởi công ty ${job.companyname}.</p>
          <p>Vui lòng nhấp vào nút bên dưới để xem công việc mới.</p>
          <p><a href="${linkJob}" class="cta-button">Xem công việc mới</a></p>
        </div>
      </body>
    </html>
  `,
                  };
                  transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                      console.log(err);
                    } else {
                      console.log("Đã gửi mail cho người đăng kí Jobs");
                    }
                  });
                }
              }

              const jobJSON = job.toJSON();
              console.log("Đây là ngày giờ sau khi định dạng: " + jobJSON);
              await job.save();
            } else {
              var job = oldjob;
            }
          } catch (err) {
            console.log(err);
          }
          const company = await CompanyModel.findOne({ iduser: user._id });
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("success", {
            job: staffMongoseToObject(job),
            user: req.user,
            company,
          });
        }
      }
    );
  }
}

module.exports = new PaymentController();
