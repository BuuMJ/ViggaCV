const express = require("express");
const router = express.Router();
const jobController = require("../app/controllers/JobController");

router.get("/", jobController.job_favourite);

module.exports = router;
