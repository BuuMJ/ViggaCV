const express = require("express");
const router = express.Router();
const appplyCVController = require("../app/controllers/ApplyCVController");
const { uploadCV } = require("../util/data");

router.post("/apply", uploadCV.single("cv"), appplyCVController.apply);
router.post("/", uploadCV.single("scancv"), appplyCVController.scan);

module.exports = router;
