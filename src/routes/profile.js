const express = require("express");
const router = express.Router();
const { upload } = require("../util/data");
const profileController = require("../app/controllers/ProfileController");

router.put("/edit", upload.single("avatar"), profileController.apiprofile);
router.post("/sendmail", profileController.sendMail);
router.get("/", profileController.profile);

module.exports = router;
