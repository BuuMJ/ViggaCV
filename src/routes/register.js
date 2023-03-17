const express = require("express");
const router = express.Router();
const registerController = require("../app/controllers/RegisterController");

router.post("/apiregister", registerController.apiregister);
router.post("/sendMailVerify", registerController.sendMailVerify);
router.get("/verify", registerController.verify);

module.exports = router;
