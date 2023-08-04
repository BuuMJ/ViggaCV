const express = require("express");
const router = express.Router();
const appplyCVController = require("../app/controllers/ApplyCVController");
const { checkLogin } = require("../util/authorize");
const { uploadCV } = require("../util/data");

router.post(
  "/apply",
  uploadCV.single("cv"),
  checkLogin,
  appplyCVController.apply
);
router.post("/", uploadCV.single("scancv"), appplyCVController.scan);

module.exports = router;
