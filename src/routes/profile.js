const express = require("express");
const router = express.Router();
const profileController = require("../app/controllers/ProfileController");

router.post("/sendmail", profileController.sendMail);
router.get("/", profileController.profile);

module.exports = router;
