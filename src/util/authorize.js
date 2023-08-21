const jwt = require("jsonwebtoken");
const { company } = require("../app/controllers/CompanyController");
const UserModel = require("../app/models/User");

//check login
function checkLogin(req, res, next) {
  //check
  try {
    var token = req.cookies.token;
    var idUser = jwt.verify(token, "PW");
    UserModel.findOne({
      _id: idUser,
    }).then((data) => {
      if (data) {
        req.user = data;
        // console.log(req.user);
        return next();
      } else {
        res.render("login", {
          title: "Login",
          msg: "Please login.",
        });
      }
    });
  } catch (err) {
    return res.render("login", {
      title: "Login",
      msg: "Please login.",
    });
  }
}

//check company
function checkCompany(req, res, next) {
  var role = req.user.role;
  if (role != user) {
    next();
  } else {
    return res.render("home", {
      title: "authorized",
      msg: "You are not authorized.",
    });
  }
}

//check User
function checkUser(req, res, next) {
  var role = req.user.role;
  if (role != company) {
    next();
  } else {
    return res.render("home", {
      title: "authorized",
      msg: "You are not authorized.",
    });
  }
}

//check company
function checkAdmin(req, res, next) {
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ");
  var role = req.user.role;
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaâ " + role);
  if (role === "admin") {
    console.log("bbbbbbbbbbbbbbbbbbb");
    next();
  } else {
    console.log("ccccccccccccccccccc");
    return res.redirect("/?messenge=You are not authorized.");
  }
}

module.exports = { checkLogin, checkAdmin, checkCompany, checkUser };
