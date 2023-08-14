const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/AdminController");

router.put("/updateUser/:id", AdminController.updateUser);
router.delete("/deleteUser/:id", AdminController.deleteUser);
router.post("/deny/:id", AdminController.denyRefund);
router.delete("/deleteJob/:id", AdminController.deleteJob);
router.get("/", AdminController.admin);

module.exports = router;
