import React from 'react';

const MyBookings = ({ bookings }) => {
  return (
    <div>
      <h3>My Bookings:</h3>
      {bookings.map((booking, index) => (
        <div key={index}>
          <p>Flight Number: {booking.flight.flightNumber}</p>
          <p>Date: {booking.flight.date}</p>
          <p>Time: {booking.flight.time}</p>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;
