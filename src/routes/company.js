const express = require("express");
const router = express.Router();
const companyController = require("../app/controllers/CompanyController");

router.get("/postjob", companyController.postjob);
router.get("/listcompany", companyController.company);

module.exports = router;
