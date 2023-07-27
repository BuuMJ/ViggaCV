const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/PaymentController");

router.get("/:id", paymentController.check);
router.get("/success", paymentController.success);
router.post("/", paymentController.pay);

module.exports = router;
