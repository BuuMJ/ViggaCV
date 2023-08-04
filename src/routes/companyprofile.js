const express = require("express");
const router = express.Router();
const companyprofileComtroller = require("../app/controllers//CompanyProfileController");
const { upload } = require("../util/data");

router.delete(
  "/leadership/delete/:id",
  companyprofileComtroller.deleteLeadership
);

router.delete("/delete/:id", companyprofileComtroller.deletejob);
router.put("/blocked/:id", companyprofileComtroller.block);
router.post(
  "/leadership",
  upload.single("avatarleadership"),
  companyprofileComtroller.leadership
);
router.post("/postjob", companyprofileComtroller.postjob);
router.put(
  "/edit",
  upload.fields([{ name: "avatar" }, { name: "background" }]),
  companyprofileComtroller.apicompanyprofile
);
router.get("/", companyprofileComtroller.companyprofile);

module.exports = router;
