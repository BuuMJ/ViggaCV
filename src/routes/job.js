const express = require("express");
const router = express.Router();
const jobController = require("../app/controllers/JobController");

router.get("/:id", jobController.detail);
router.get("/", jobController.job);

module.exports = router;
