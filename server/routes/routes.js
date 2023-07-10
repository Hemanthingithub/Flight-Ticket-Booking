const express = require('express');
const router = express.Router();
const userRoutes = require("./users.routes");
const flightRoutes = require("./flights.routes");

router.use("/auth", userRoutes);

router.use("/flight", flightRoutes);

module.exports = router;
