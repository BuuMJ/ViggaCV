const paypal = require("paypal-rest-sdk");
const JobModel = require("../models/Job");
const moment = require("moment-timezone");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");
const { job } = require("./JobController");

class PaymentController {
  pay(req, res, next) {
    const price = 1.5;
    if (req.body.paymentday) {
      var days = req.body.paymentday;
      console.log(days + "concccccccccccc");
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
}

module.exports = new PaymentController();
