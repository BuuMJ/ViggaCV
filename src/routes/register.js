const express = require("express");
const router = express.Router();
const registerController = require("../app/controllers/RegisterController");

router.post("/apiregister", registerController.apiregister);
router.get("/", registerController.verify);

module.exports = router;
