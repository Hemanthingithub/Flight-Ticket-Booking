require('dotenv').config();

const mongoString = process.env.DATABASE_URL
const routes = require('./routes/routes');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api', routes);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Flight Booking" });
});

const PORT = process.env.PORT || 8080;

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.error(error);
})

database.once('connected', () => {
    console.info('Database Connected');
})

app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}.`);
});
