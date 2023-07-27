const paypal = require("paypal-rest-sdk");
const axios = require("axios");

class PaymentController {
  pay(req, res, next) {
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
                price: "10.00",
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "10.00",
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
    var payerID = req.query.PayerID;
    var execute_payment_json = {
      payer_id: payerID,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "10.00",
          },
        },
      ],
    };

    var paymentId = req.query.paymentId;

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log("Get Payment Response");
          console.log(JSON.stringify(payment));
          res.render("confirm", {
            jobID: jobID,
          });
        }
      }
    );
  }

  check(req, res, next) {
    const jobID = req.params.id;
    req.session.jobID = jobID;
    res.redirect("/pay");
  }
}

module.exports = new PaymentController();
