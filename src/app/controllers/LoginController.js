const UserModel = require("../../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class LoginController {
  //[GET] login
  login(req, res, next) {
    res.render("login", {
      title: "Login",
    });
  }

  // [POST] login
  apilogin(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    UserModel.findOne({
      username: username,
    })
      .then((data) => {
        if (data) {
          if (!data.isVerified) {
            return res.render("verify", {
              msg: "Email chưa được xác minh",
            });
          }
          var token = jwt.sign(
            {
              _id: data._id,
            },
            "PW"
          );
          bcrypt.compare(password, data.password, function (err, result) {
            if (err) {
              return res.render("login", {
                msg: "The user or password is incorrect.",
              });
            }
            if (result) {
              res.cookie("token", token, {
                expires: new Date(Date.now() + 18000000000),
              });
              return res.redirect("/");
            } else {
              return res.render("login", {
                msg: "The user or password is incorrect.",
              });
            }
          });
        } else {
          return res.render("login", {
            msg: "The user or password is incorrect.",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json("loi sever");
      });
  }
  //[POST] Send mail reset password
  resetPassword(req, res, next) {
    const email = req.body.email;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const token = jwt.sign({ email: email }, "PW", { expiresIn: "1h" });
    const verifyLink = `http://localhost:3000/login/resetpassword?token=${token}`;
    const mailOptions = {
      to: email, // list of receivers
      subject: "Reset Password", // Subject line
      html: `Please click <a href="${verifyLink}">here</a> to reset password your account.`, // plain text body
    };
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log(err);
      } else {
        bcrypt.hash(email, 10, function (err, hash) {});
        console.log("Đã gửi mail");
        return res.redirect("/login");
      }
    });
  }
}
module.exports = new LoginController();
