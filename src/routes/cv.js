const express = require("express");
const router = express.Router();
const cvController = require("../app/controllers/CvController");
const { checkLogin, checkUser } = require("../util/authorize");
const { sendDataUser } = require("../util/data");
const { upload } = require("../util/data");

// router.post("/exportcv", checkLogin, cvController.exportCV);
router.post(
  "/export",
  checkLogin,
  checkUser,
  upload.single("file"),
  cvController.export
);
router.get("/createcv", checkLogin, checkUser, cvController.createCV);
router.get("/exportcv", checkLogin, cvController.cvpdf);
router.get("/", sendDataUser, checkUser, cvController.cv);

module.exports = router;
