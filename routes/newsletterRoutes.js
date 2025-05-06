const express = require("express");
const newsletterController = require("../controllers/newsletterController");

const router = express.Router();

router.post("/newsletter/subscribe", newsletterController.subscribeNewsletter);

module.exports = router;
