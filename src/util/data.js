const jwt = require("jsonwebtoken");
const UserModel = require("../app/models/User");
const multer = require("multer");
const JobModel = require("../app/models/Job");
const fs = require("fs");
const CompanyModel = require("../app/models/Company");
const { company } = require("../app/controllers/CompanyController");

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
        // console.log(req.user + "aaaaaaaaaaaaaaaa");
        next();
      } else {
        next();
      }
    });
  } catch (err) {
    // console.log(
    //   "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    // );
    next();
  }
}

//Job count
async function jobcount(req, res, next) {
  try {
    const jobcount = await JobModel.aggregate([
      { $group: { _id: "$companyname", jobcount: { $sum: 1 } } },
    ]);

    for (const result of jobcount) {
      const { _id, jobcount } = result;
      // console.log(
      //   result._id +
      //     " day la gia tri resulttttttttttttttttttttttttttttttttttttttttttttttt"
      // );

      await CompanyModel.updateOne(
        { companyname: _id },
        { jobcount: jobcount }
      );
    }
    return next();
  } catch (err) {
    console.log(err);
  }
}

// Upload files
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

// Upload file CV
const storage2 = multer.diskStorage({
  destination: function (req, file, cb) {
    // Tạo đường dẫn đầy đủ cho thư mục lưu trữ của CV đó
    var path = req.customPath || "uploads/Cv";
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
  if (
    !file.originalname.match(
      /\.(jpg|jpeg|png|gif|JPG|JPEG|PNG|GIF|heic|HEIC|webp|WEBP)$/
    )
  ) {
    return cb(new Error("Chỉ chấp nhận file hình ảnh"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter, // sử dụng hàm filter để chỉ lấy file ảnh
});

const uploadCV = multer({
  storage: storage2,
});

module.exports = { sendDataUser, jobcount, upload, uploadCV };
