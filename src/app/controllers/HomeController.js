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

    const mailOptions = {
      to: "nxt03091999@gmail.com", // list of receivers
      subject: "test mail", // Subject line
      html: feedback + " of " + user.email, // plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log(info);
        res.render("home", { msg: "You have responded successfully" });
      }
    });
  }
}
module.exports = new HomeController();