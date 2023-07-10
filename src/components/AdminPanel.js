import React from "react";

const AdminPanel = ({
  flights,
  handleAddFlight,
  handleRemoveFlight,
  handleViewBookings,
}) => {
  const handleFlightFormSubmit = (e) => {
    e.preventDefault();
    // Get the form values and pass them to handleAddFlight function
    const flightNumber = e.target.elements.flightNumber.value;
    const source = e.target.elements.source.value;
    const destination = e.target.elements.destination.value;
    const capacity = e.target.elements.capacity.value;
    const time = e.target.elements.time.value;
    handleAddFlight({
      flightNo: flightNumber,
      source,
      destination,
      capacity,
      time,
    });
    e.target.reset();
  };

  const handleFlightRemoval = (flight) => {
    handleRemoveFlight(flight);
  };

  const handleBookingsView = (flight) => {
    handleViewBookings(flight);
  };

  return (
    <div>
      <h3>Flight List:</h3>
      {flights.map((flight, index) => (
        <div key={index}>
          <p>Flight Number: {flight.flightNo}</p>
          <p>Date: {flight.date || new Date().toString()}</p>
          <p>Time: {flight.time}</p>
          <p>Available Seats: {flight.capacity}</p>
          <button onClick={() => handleFlightRemoval(flight)}>Remove</button>
          <button onClick={() => handleBookingsView(flight)}>
            View Bookings
          </button>
        </div>
      ))}
      <h3>Add Flight:</h3>
      <form onSubmit={handleFlightFormSubmit}>
        <input
          type="text"
          placeholder="Flight Number"
          name="flightNumber"
          required
        />
        <input type="text" placeholder="Source" name="source" required />
        <input
          type="text"
          placeholder="Destination"
          name="destination"
          required
        />
        <input type="number" placeholder="Capacity" name="capacity" required />
        <input type="time" placeholder="Time" name="time" required />
        <button type="submit">Add Flight</button>
      </form>
    </div>
  );
};

export default AdminPanel;
