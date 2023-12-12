const express = require("express");
const router = express.Router();
const jobController = require("../app/controllers/JobController");

router.get("/scan", jobController.scan);
router.get("/job_favourite", jobController.job_favourite);
router.post("/favourite", jobController.favourite);
router.get("/search", jobController.search);
router.get("/detail/:id", jobController.detail);
router.get("/", jobController.job);

module.exports = router;
