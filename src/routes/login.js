const express = require("express");
const router = express.Router();
const loginController = require("../app/controllers/LoginController");

router.post("/resetpassword", loginController.resetPassword);
router.post("/apilogin", loginController.apilogin);
router.get("/", loginController.login);

module.exports = router;
