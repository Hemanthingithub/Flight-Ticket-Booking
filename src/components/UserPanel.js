import React from 'react';

const UserPanel = ({ flights, handleBooking }) => {
  return (
    <div>
      <h3>Flight List:</h3>
      {flights.map((flight, index) => (
        <div key={index}>
          <p>Flight Number: {flight.flightNumber}</p>
          <p>Date: {flight.date}</p>
          <p>Time: {flight.time}</p>
          <button onClick={() => handleBooking(flight)}>Book Flight</button>
        </div>
      ))}
    </div>
  );
};

export default UserPanel;
