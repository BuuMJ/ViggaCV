const express = require("express");
const router = express.Router();
const companyController = require("../app/controllers/CompanyController");
const { checkCompany, checkUser } = require("../util/authorize");
const {jobcount} = require('../util/data')

router.get("/postjob", companyController.postjob);
router.get("/job", companyController.applyjob);
router.get("/:id",jobcount, companyController.information);
router.get("/",jobcount, companyController.company);

module.exports = router;