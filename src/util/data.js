const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");

//check login
function sendDataUser(req, res, next) {
  //check
  try {
    var token = req.cookies.token;
    var idUser = jwt.verify(token, "PW");
    UserModel.findOne({
      _id: idUser,
    }).then((data) => {
      if (data) {
        req.user = data;
        console.log(req.user + "aaaaaaaaaaaaaaaa");
        return next();
      } else {
        return next();
      }
    });
  } catch (err) {
    console.log(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    );
    return next();
  }
}

module.exports = { sendDataUser };
