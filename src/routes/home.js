const express = require("express");
const router = express.Router();
const homeController = require("../app/controllers/HomeController");

router.post("/feedback", homeController.feedback);
router.get("/", homeController.home);

module.exports = router;
