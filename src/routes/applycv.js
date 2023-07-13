const express = require("express");
const router = express.Router();
const appplyCVController = require("../app/controllers/ApplyCVController");
const { uploadCV } = require("../util/data");

router.post("/", uploadCV.single("scancv"), appplyCVController.apply);

module.exports = router;
