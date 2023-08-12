const express = require("express");
const router = express.Router();
const AdminController = require("../app/controllers/AdminController");

router.put("/updateUser/:id", AdminController.updateUser);
router.delete("/deleteUser/:id", AdminController.deleteUser);
router.get("/", AdminController.admin);

module.exports = router;
