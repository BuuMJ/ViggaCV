const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/LoginController");

router.post("/mailresetpassword", loginController.mailResetPassword);
router.post("/resetpassword", loginController.resetPassword);
router.post("/apilogin", loginController.apilogin);
router.get("/verify", loginController.verify);
router.get("/", loginController.login);

module.exports = router;
