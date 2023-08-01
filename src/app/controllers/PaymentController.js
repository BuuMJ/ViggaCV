const paypal = require("paypal-rest-sdk");
const JobModel = require("../models/Job");
const {
  mutipleMongooseToObject,
  staffMongoseToObject,
} = require("../../util/mongoose");

class PaymentController {
  pay(req, res, next) {
    const price = 1.43;
    if (req.body.days) {
      var days = req.body.days;
    } else {
      var days = 30;
    }
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
  success(req, res, next) {
    const jobID = req.session.jobID;
    const total = req.session.total;
    const days = 7;
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

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      async function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          try {
            let job = await JobModel.findById(jobID);
            job.prioritize = true;
            job.prioritizeUpdatedAt = moment().add(days, "days").toDate();
            await job.save();
          } catch (err) {
            console.log(err);
          }
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("confirm", {
            jobID: jobID,
          });
        }
      }
    );
  }

  async check(req, res, next) {
    const jobID = req.params.id;
    req.session.jobID = jobID;
    const job = await JobModel.findById({ _id: jobID });
    if (job.prioritize == false) {
      // res.redirect("/pay");
      res.render("check",{
        user: req.user,
        job: staffMongoseToObject(job),
      });
    } else {
      res.redirect("back");
    }
  }
}

module.exports = new PaymentController();
