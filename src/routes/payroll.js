const express = require("express")
const router = express.Router();
const payrollController = require("../app/controllers/PayrollController")

router.get("/", payrollController.payroll)

module.exports = router