const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    username:  { type: String, required: true },
    flightNo: { type: String, unique: true },
    source: { type: String },
    destination: { type: String },
    name: { type: String },
    age: { type: Number },
    gender: { type: String },
    time: { type: String },
    date: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("booking", bookingSchema, "bookings");
