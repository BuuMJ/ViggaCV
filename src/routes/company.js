const express = require("express");
const router = express.Router();
const companyController = require("../app/controllers/CompanyController");
const { checkCompany, checkUser } = require("../util/authorize");
const { jobcount } = require("../util/data");
const CompanyController = require("../app/controllers/CompanyController");

router.get("/search", jobcount, CompanyController.search);
router.get("/categories", jobcount, CompanyController.categories);
router.get("/job/:id", jobcount, companyController.information);
router.get("/:id", jobcount, companyController.detail);
router.post("/:id/follow", jobcount, companyController.follow);
router.get("/", jobcount, companyController.company);

module.exports = router;
