const nodemailer = require("nodemailer");

class ProfileController {
  profile(req, res, next) {
    res.render("profile", {
      title: "Profile User",
    });
  }

  sendMail(req, res, next) {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });

    const mailOptions = {
      to: "nxt03091999@gmail.com", // list of receivers
      subject: "test mail", // Subject line
      html: "<h1>this is a test mail.</h1>", // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) console.log(err);
      else console.log(info);
    });
  }
}
module.exports = new ProfileController();
