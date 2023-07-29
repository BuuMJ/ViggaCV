const express = require("express");
const router = express.Router();
const cvController = require("../app/controllers/CvController");
const { checkLogin } = require("../util/authorize");
const { sendDataUser } = require("../util/data");

router.post("/exportcv", checkLogin, cvController.exportCV);
router.post("/export", checkLogin, cvController.export);
router.get("/createcv", checkLogin, cvController.createCV);
router.get("/exportcv/:id", cvController.cvpdf);
router.get("/", checkLogin, cvController.cv);

module.exports = router;
