const express = require("express");
const router = express.Router();
const paymentController = require("../app/controllers/PaymentController");

router.get("/success", paymentController.success);
router.get("/cancel", paymentController.cancel);
router.get("/:id", paymentController.check);
router.post("/", paymentController.pay);

module.exports = router;
