
const express = require('express');
const { verifyToken, checkRole } = require("../middleware/auth");
const router = express.Router()
const flightService = require("../services/flights.service");

router.get("/my-bookings", verifyToken, flightService.myBookings);

router.post("/bookings",  [verifyToken, checkRole(["ADMIN"])], flightService.listBookings);

router.post ("/add", [verifyToken, checkRole(["ADMIN"])],  flightService.addFlight)

router.post("/book", verifyToken, flightService.bookFlight);

router.post("/list", verifyToken, flightService.listFlights);

router.delete("/remove/:id", [verifyToken, checkRole(["ADMIN"])], flightService.removeFlight);

module.exports = router;
