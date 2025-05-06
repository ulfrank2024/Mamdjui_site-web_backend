const express = require("express");
const reservationsController = require("../controllers/reservationsController");

const router = express.Router();

router.post("/reservations", reservationsController.createReservation);

module.exports = router;
