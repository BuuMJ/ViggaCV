const UserModel = require("../../models/User");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

class RegisterController {
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
              });
            } else {
              // Người dùng tồn tại trong CSDL
              // Xác minh tài khoản của người dùng tại đây
              user.isVerified = true;
              user
                .save()
                .then((data) => {
                  if (data) {
                    res.render("login");
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

  //[POST] Register
  apiregister(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var fullname = req.body.fullname;
    var email = req.body.email;
    var role = req.body.role;
    var phone = req.body.phone;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const token = jwt.sign({ email: email }, "PW", { expiresIn: "1h" });
    const verifyLink = `http://localhost:3000/register/verify?token=${token}`;
    const mailOptions = {
      to: email, // list of receivers
      subject: "Sign Up Success", // Subject line
      html: `Please click <button><a href="${verifyLink}">here</a></button> to verify your account.`, // plain text body
    };

    UserModel.findOne({
      username: username,
    })
      .then((data) => {
        if (data) {
          const message = "Account already exists!";
          const url =
            "/resigter?" + querystring.stringify({ message: message });
          res.redirect(url);
        } else {
          UserModel.findOne({
            email: email,
          })
            .then((data) => {
              if (data) {
                const message = "Email already exists!";
                const url =
                  "/resigter?" + querystring.stringify({ message: message });
                res.redirect(url);
              } else {
                UserModel.findOne({
                  phone: phone,
                })
                  .then((data) => {
                    if (data) {
                      const message = "Number phone already exists!";
                      const url =
                        "/resigter?" +
                        querystring.stringify({ message: message });
                      res.redirect(url);
                    } else {
                      bcrypt.hash(password, 10, function (err, hash) {
                        UserModel.create({
                          username: username,
                          password: hash,
                          fullname: fullname,
                          email: email,
                          phone: phone,
                          role: role,
                        });
                      });
                      transporter.sendMail(mailOptions, function (err, info) {
                        if (err) {
                          console.log(err);
                          console.log("Không gửi được mail");
                          res.json("Không thể gửi mail");
                        } else {
                          if (info) {
                            console.log(info);
                            console.log("Đã gửi mail");
                            return res.redirect("/login");
                          }
                        }
                      });
                    }
                  })
                  .catch((err) => {
                    console.error(err);
                    res.json("Lỗi khi kiểm tra số điện thoại");
                  });
              }
            })
            .catch((err) => {
              console.error(err);
              res.json("Lỗi khi kiểm tra địa chỉ email");
            });
        }
      })
      .catch((err) => {
        console.error(err);
        res.json("Lỗi khi kiểm tra tài khoản");
      });
  }

  //[POST] Send mail verify
  sendMailVerify(req, res, next) {
    const email = req.body.email;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "duoc6694@gmail.com",
        pass: "wdymtvgbhblstfbj",
      },
    });
    const token = jwt.sign({ email: email }, "PW", { expiresIn: "1h" });
    const verifyLink = `http://localhost:3000/register/verify?token=${token}`;
    const mailOptions = {
      to: email, // list of receivers
      subject: "Sign Up Success", // Subject line
      html: `Please click <a href="${verifyLink}">here</a> to verify your account.`, // plain text body
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
module.exports = new RegisterController();
