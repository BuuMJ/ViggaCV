const express = require("express");
const router = express.Router();
const companyprofileComtroller = require("../app/controllers//CompanyProfileController");
const { upload } = require("../util/data");

router.put(
  "/edit",
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  companyprofileComtroller.apicompanyprofile
);
router.post("/postjob", companyprofileComtroller.postjob);
router.get("/", companyprofileComtroller.companyprofile);

module.exports = router;
