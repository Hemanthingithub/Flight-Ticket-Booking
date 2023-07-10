const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    flightNo: { type: String, unique: true },
    source: { type: String },
    destination: { type: String },
    capacity: { type: Number, default: 60 },
    time: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("flight", flightSchema, "flights");
