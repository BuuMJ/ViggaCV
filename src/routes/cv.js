const express = require("express");
const router = express.Router();
const cvController = require('../app/controllers/CvController')

router.get('/createcv', cvController.createCV);
router.get('/', cvController.cv);

module.exports = router;