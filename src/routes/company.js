const express = require("express");
const router = express.Router();
const companyController = require("../app/controllers/CompanyController");
const { checkCompany, checkUser } = require("../util/authorize");
const { jobcount } = require("../util/data");

router.get("/job/:id", jobcount, companyController.information);
router.get("/:id", jobcount, companyController.detail);
router.get("/", jobcount, companyController.company);

module.exports = router;
