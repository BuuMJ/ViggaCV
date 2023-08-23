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
  if (req.user) {
    var role = req.user.role;
    if (role != "user") {
      next();
    } else {
      return res.redirect("/?messenge=You are not authorized.");
    }
  } else {
    return next();
  }
}

//check User
function checkUser(req, res, next) {
  if (req.user) {
    var role = req.user.role;
    console.log(role);
    if (role != "company") {
      next();
    } else {
      return res.redirect("/?messenge=You are not authorized.");
    }
  } else {
    return next();
  }
}

//check company
function checkAdmin(req, res, next) {
  var role = req.user.role;
  if (role === "admin") {
    next();
  } else {
    return res.redirect("/?messenge=You are not authorized.");
  }
}

module.exports = { checkLogin, checkAdmin, checkCompany, checkUser };
