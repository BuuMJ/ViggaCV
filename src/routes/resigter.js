const express = require("express");
const router = express.Router();
const resigterController = require("../app/controllers/ResigterController");

router.post("/apiresigter", resigterController.apiregister);
router.get("/", resigterController.resigter);

module.exports = router;
