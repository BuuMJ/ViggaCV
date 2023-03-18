const nodemailer = require("nodemailer");

class HomeController {
  home(req, res, next) {
    res.render("home", {
      title: "Vigga Home",
      user: req.user,
    });
  }

  //[POST] feedback
  feedback(req, res, next) {
    const feedback = req.body.feedback;
    const user = req.user;
    console.log(user + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    if (user != undefined) {
      const mailOptions = {
        to: "nxt03091999@gmail.com", // list of receivers
        subject: "test mail", // Subject line
        html: "Feedback: " + feedback + " from " + user.email, // plain text body
      };

      transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
          console.log(err);
        } else {
          console.log(info);
          res.render("home", {
            msg: "You have responded successfully",
            user: req.user,
          });
        }
      });
    } else {
      res.render("login");
    }
  }
}
module.exports = new HomeController();
