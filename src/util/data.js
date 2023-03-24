const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const multer = require("multer");
const fs = require("fs");

//send data user
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
    // console.log(
    //   "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    // );
    return next();
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo đường dẫn đầy đủ cho thư mục lưu trữ của submission đó
    var path = "uploads/";
    // Tạo thư mục nếu chưa tồn tại
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Hàm filter
const imageFilter = function (req, file, cb) {
  // Chỉ chấp nhận file hình ảnh
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF)$/)) {
    return cb(new Error("Chỉ chấp nhận file hình ảnh"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter, // sử dụng hàm filter để chỉ lấy file ảnh
});

module.exports = { sendDataUser, upload };
