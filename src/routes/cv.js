const express = require("express");
const router = express.Router();
const cvController = require("../app/controllers/CvController");
const { sendDataUser } = require("../util/data");

router.post("/exportcv", cvController.exportCV);
router.get("/createcv", sendDataUser, cvController.createCV);
router.get("/", cvController.cv);

module.exports = router;
