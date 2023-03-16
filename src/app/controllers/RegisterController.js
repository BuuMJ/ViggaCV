const UserModel = require("../../models/User");
const bcrypt = require("bcrypt");

class RegisterController {
  //[GET] Resigter
  register(req, res, next) {
    res.render("login", {
      title: "Register",
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
                      return res.redirect("/login");
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
}
module.exports = new RegisterController();
