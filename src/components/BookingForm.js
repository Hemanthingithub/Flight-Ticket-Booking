import React from 'react';

const BookingForm = ({ flight, handleBooking }) => {
  return (
    <div>
      <h3>Flight Details:</h3>
      <p>Flight Number: {flight.flightNumber}</p>
      <p>Date: {flight.date}</p>
      <p>Time: {flight.time}</p>
      <button onClick={() => handleBooking(flight)}>Book Flight</button>
    </div>
  );
};

export default BookingForm;
