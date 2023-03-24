const express = require("express");
const router = express.Router();
const companyController = require("../app/controllers/CompanyController");
const { checkCompany, checkUser } = require("../util/authorize");

router.get("/postjob", companyController.postjob);
router.get("/listcompany", companyController.company);

module.exports = router;
