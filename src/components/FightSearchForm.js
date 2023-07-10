import React, { useState } from 'react';

const FlightSearchForm = ({ handleFlightSearch }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFlightSearch(date, time);
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="date"
        placeholder="Date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        placeholder="Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button type="submit">Search Flights</button>
    </form>
  );
};

export default FlightSearchForm;
