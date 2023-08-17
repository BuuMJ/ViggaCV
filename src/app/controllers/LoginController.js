const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class LoginController {
  //[GET] login
  login(req, res, next) {
    const msg = req.query.messenge;
    res.render("login", {
      title: "Login",
      msg,
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
              msg: "Email is not verified",
            });
          }
          var token = jwt.sign(
            {
              _id: data._id,
            },
            "PW"
          );
          console.log(password);
          console.log(data.password);
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
  mailResetPassword(req, res, next) {
    const email = req.body.email;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const token = jwt.sign({ email: email }, "PW", { expiresIn: "1h" });
    const verifyLink = `http://localhost:3000/login/verify?token=${token}`;
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

  //[GET] Verify Account
  verify(req, res, next) {
    // Giải mã token để kiểm tra địa chỉ email
    const token = req.query.token;
    jwt.verify(token, "PW", function (err, decoded) {
      if (err) {
        // Token không hợp lệ hoặc đã hết hạn
        // Xử lý lỗi tại đây
        res.render("verify", {
          msg: "Token is invalid or expired, please verify again",
          title: "verify",
        });
      } else {
        // Token hợp lệ
        const email = decoded.email;

        // Kiểm tra địa chỉ email trong token với địa chỉ email trong CSDL
        UserModel.findOne({ email: email })
          .then((user) => {
            if (!user) {
              // Người dùng không tồn tại trong CSDL
              res.render("login", {
                msg: "The account does not exist, please re-register",
                title: "Login",
              });
            } else {
              // Người dùng tồn tại trong CSDL
              // Xác minh tài khoản của người dùng tại đây
              user.isVerified = true;
              user
                .save()
                .then((data) => {
                  if (data) {
                    req.session.resetPassword = data;
                    res.render("resetpassword", {
                      title: "Reset Password",
                    });
                  }
                })
                .catch((err) => {
                  console.error(err);
                });
            }
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }

  //[POST] reset password
  resetPassword(req, res, next) {
    const _id = req.session.resetPassword._id;
    const { newpassword } = req.body;
    UserModel.findOne({ _id: _id })
      .then((user) => {
        if (user) {
          bcrypt.hash(newpassword, 10, function (err, hash) {
            if (err) {
              console.log(err);
              res.status(500).send("Internal server error");
            } else {
              user.password = hash;
              user
                .save()
                .then(() => {
                  res.render("login", {
                    title: "Login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(500).send("Internal server error");
                });
            }
          });
        } else {
          res.status(404).send("User not found");
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
      });
  }
}
module.exports = new LoginController();
