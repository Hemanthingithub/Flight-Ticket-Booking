const Flight = require("../models/Flight");
const Booking = require("../models/Booking");

const addFlight = async (req, res) => {
  try {
    const { flightNo, source, destination, capacity = 60, time } = req.body;
    if (!(flightNo && source && destination && time)) {
      return res.status(400).send("All input is required");
    }
    const flight = JSON.parse(
      JSON.stringify(await Flight.findOne({ flightNo }))
    );

    if (flight) {
      return res.status(400).send("Flight already exists");
    }

    const newFlight = await Flight.create({
      flightNo,
      source,
      destination,
      capacity,
      time,
    });

    res.status(200).send(newFlight);
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
};

const removeFlight = async (req, res) => {
  try {
    const { id } = req.params;

    const flight = await Flight.findOne({ flightNo: id });

    if (!flight) {
      return res.status(400).send("Flight not found");
    }

    await Flight.deleteOne({ flightNo: id });

    res.status(200).send("Flight deleted successfully");
  } catch (err) {
    console.error(err);
    return res.status(400).send("Something went wrong");
  }
};

const listFlights = async (req, res) => {
  try {
    const { isAll = false, date, time, source, destination } = req.body;
    const { role } = req.user;
    if (isAll && role === "ADMIN") {
      const flights = JSON.parse(
        JSON.stringify(await Flight.find({}))
      );
      return res.status(200).send(flights);
    }
    const bookings = JSON.parse(
      JSON.stringify(await Booking.find({ source, destination, time, date }))
    );
    const flights = JSON.parse(
      JSON.stringify(await Flight.find({ time, source, destination }))
    );
    if (bookings.length)
      flights.forEach((flight) => {
        const booking = bookings.filter(
          (booking) => booking.flightNo === flight.flightNo
        );
        flight.capacity -= booking.length;
      });

    res.status(200).send(flights);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};

const myBookings = async (req, res) => {
  try {
    const { username } = req.user;
    const bookings = await Booking.find({ username });
    res.status(200).send(bookings);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};

const bookFlight = async (req, res) => {
  try {
    const { flightNo, source, destination, name, age, gender, time, date } =
      req.body;
    const { username } = req.user;
    const isAvaiable = await Booking.countDocuments({ flightNo, date, time });
    if (isAvaiable >= 30) {
      return res.status(400).send("Flight seats not available");
    }
    const booking = await Booking.create({
      username,
      flightNo,
      source,
      destination,
      name,
      age,
      gender,
      time,
      date,
    });
    res.status(200).send(booking);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};

const listBookings = async (req, res) => {
  try {
    const { flightNo, time } = req.body;
    const bookings = await Booking.find({ flightNo, time });
    res.status(200).send(bookings);
  } catch (err) {
    return res.status(400).send("Something went wrong");
  }
};

module.exports = {
  addFlight,
  removeFlight,
  listFlights,
  bookFlight,
  listBookings,
  myBookings,
};
