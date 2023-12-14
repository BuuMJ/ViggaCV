const express = require("express");
const router = express.Router();
const companyprofileComtroller = require("../app/controllers/CompanyProfileController");
const { upload } = require("../util/data");

router.post("/send", companyprofileComtroller.invite);
router.get("/", companyprofileComtroller.managerCV);

module.exports = router;
