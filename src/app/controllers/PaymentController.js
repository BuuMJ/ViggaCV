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
const RevenueModel = require("../models/Revenua");

class PaymentController {
  pay(req, res, next) {
    delete req.session.revenueCreated;
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
        return_url: "https://vigga-careers.onrender.com/pay/success",
        cancel_url: "https://vigga-careers.onrender.com/pay/cancel",
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
            const saleId = payment.transactions[0].related_resources[0].sale.id;
            if (!req.session.revenueCreated) {
              var revenue = new RevenueModel({
                iduser: req.user._id,
                idcompany: company._id,
                idjob: jobID,
                money: total,
                type: "prioritize",
                jobname: job.jobname,
                paymentId: saleId,
              });
              await revenue.save();
              req.session.revenueCreated = true;
            }
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
    delete req.session.success;
    var create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "https://vigga-careers.onrender.com/pay/successjob",
        cancel_url: "https://vigga-careers.onrender.com/pay/cancel",
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
            if (!req.session.success) {
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
              await job.save();
              const saleId =
                payment.transactions[0].related_resources[0].sale.id;
              req.session.success = true;
              var revenue = new RevenueModel({
                iduser: iduser,
                idcompany: companyname._id,
                idjob: job._id,
                money: 30,
                type: "post job",
                paymentId: saleId,
                jobname: job.jobname,
              });
              await revenue.save();
              if (job) {
                if (combinedEmails.length > 0) {
                  var transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                      user: "duoc6694@gmail.com",
                      pass: "wdymtvgbhblstfbj",
                    },
                  });
                  const linkJob = `https://vigga-careers.onrender.com/job/${job._id}`;
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
                                    color: #ffffff !important;
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
                      console.log("Đã gửi mail cho người post Jobs");
                    }
                  });
                }
              }

              const jobJSON = job.toJSON();
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

  async refund(req, res, next) {
    const idjob = req.params.id;
    const type = req.body.type;
    const email = req.user.email;
    const check = await JobModel.findOne({
      _id: idjob,
      request: "all",
    });
    console.log(
      req.user.fullname +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ"
    );
    console.log(
      type +
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ"
    );
    if (type === "post job") {
      console.log(
        check +
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ"
      );
      if (check) {
        return res.redirect("/admin?message=Please refund post job first");
      }
    }
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const revenue = await RevenueModel.findOne({
      idjob: idjob,
      type: type,
    })
      .sort({ createdAt: -1 })
      .limit(1);
    const amount = { total: revenue.money.toString(), currency: "USD" };
    paypal.sale.refund(
      revenue.paymentId,
      { amount: amount },
      async function (error, refund) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          if (type === "post job") {
            await JobModel.findByIdAndDelete(idjob);
            await RevenueModel.findByIdAndUpdate(revenue._id, {
              type: "refund",
              refundUpdateAt: Date.now(),
              admin: req.user.fullname,
            });
            console.log("Đã xoá job sau khi hoàn tiền");
          }
          if (type === "prioritize") {
            if (check.request === "all") {
              await JobModel.findByIdAndUpdate(idjob, {
                prioritize: false,
                request: "post job",
              });
            } else {
              await JobModel.findByIdAndUpdate(idjob, {
                prioritize: false,
                request: "non",
              });
            }
            await RevenueModel.findByIdAndUpdate(revenue._id, {
              type: "refund",
              refundUpdateAt: Date.now(),
              admin: req.user.fullname,
            });
            console.log(
              "Đã xoá job khỏi danh sách job được ưu tiên sau khi hoàn tiền"
            );
          }
          console.log("Refund Response");
          // console.log(JSON.stringify(refund));
          const transactionId = revenue.paymentId;
          const refundAmount = revenue.money;
          const currency = "USD";
          const mailOptions = {
            to: email, // list of receivers
            subject: "Refund Notification", // Subject line
            html: `<p style="font-family: Arial; color: #333;">Dear Customer,</p>
         <p style="font-family: Arial; color: #333;">We are writing to inform you that a refund has been processed for your recent job posting. The refund details are as follows:</p>
         <ul style="font-family: Arial; color: #333;">
           <li>Transaction ID: ${transactionId}</li>
           <li>Amount: ${refundAmount} ${currency}</li>
         </ul>
         <p style="font-family: Arial; color: #333;">Thank you for choosing our service!</p>
         <p style="font-family: Arial; color: #333;">Best regards,</p>
         <p style="font-family: Arial; color: #333;">ViggaCareers</p>`,
          };
          transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log("Đã gửi mail sau khi refund thành công");
              res.redirect("back");
            }
          });
        }
      }
    );
  }
}

module.exports = new PaymentController();
