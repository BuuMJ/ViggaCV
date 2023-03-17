const UserModel = require("../../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
          if (!data.isEmailVerified) {
            return res.render("login", {
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
                expires: new Date(Date.now() + 1800000),
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
}
module.exports = new LoginController();
