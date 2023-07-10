import React, { useState, useEffect } from "react";
import LoginForm from "./components/LoginForm";
import SignUpForm from "./components/SignUpForm";
import BookingForm from "./components/BookingForm";
import MyBookings from "./components/MyBookings";
import AdminPanel from "./components/AdminPanel";
import AdminLoginForm from "./components/AdminLoginForm";
import UserPanel from "./components/UserPanel";
import FlightSearchForm from "./components/FightSearchForm";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookings, setBookings] = useState([]);

  const handleUserLogin = (username, password) => {
    const apiUrl = "http://localhost:8080/api/auth/login"; // Replace with your user login API endpoint

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((text) => {
        try {
          const data = JSON.parse(text);
          if (data.success) {
            setLoggedInUser({ username });
          } else {
          }
        } catch (error) {
          throw new Error("Failed to parse JSON response");
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const apiUrl = "http://localhost:8080/api/flight/list";

    if (loggedInUser && loggedInUser.token && loggedInUser.role === "ADMIN")
      fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": loggedInUser.token,
        },
        body: JSON.stringify({ isAll: true }),
      })
        .then((response) => response.json())
        .then((data) => setFlights(data))
        .catch((error) => {});
  }, [loggedInUser]);

  const handleAdminLogin = (username, password) => {
    const apiUrl = "http://localhost:8080/api/auth/login";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          setIsAdminLoggedIn(true);
          setLoggedInUser(data);
        } else {
        }
      })
      .catch((error) => {});
  };

  const handleSignUp = (username, password) => {
    const apiUrl = "/data/users.json";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((users) => {
        const existingUser = users.find((user) => user.username === username);
        if (existingUser) {
          return;
        }

        const newUser = {
          username,
          password,
        };

        const updatedUsers = [...users, newUser];

        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUsers),
        });
      })
      .then(() => {
        setLoggedInUser({ username });
      })
      .catch((error) => {});
  };

  const handleFlightSearch = (date, time) => {
    const apiUrl = "http://localhost:8080/api/flight/list";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const searchedFlights = data.filter(
          (flight) => flight.date === date && flight.time === time
        );
        setFlights(searchedFlights);
      })
      .catch((error) => {});
  };

  const handleBooking = (flight) => {
    const bookingId = bookings.length + 1; // Generate a unique booking ID
    const booking = {
      id: bookingId,
      user: loggedInUser.username,
      flight: {
        id: flight.id,
        flightNumber: flight.flightNumber,
        date: flight.date,
        time: flight.time,
      },
    };

    const apiUrl = "/data/bookings.json";

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const updatedBookings = [...data, booking];
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedBookings),
        });
      })
      .then(() => {
        const updatedBookings = [...bookings, booking];
        setBookings(updatedBookings);
        updateAvailableSeats(flight, flight.availableSeats - 1);
      })
      .catch((error) => {});
  };

  const handleAddFlight = (payload) => {
    const apiUrl = "http://localhost:8080/api/flight/add";

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": loggedInUser.token,
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": loggedInUser.token,
          },
          body: JSON.stringify({ isAll: true }),
        });
      })
      .then((response) => response.json())
      .then((flights) => {
        setFlights(flights);
      })
      .catch((error) => {});
  };

  const handleRemoveFlight = (flight) => {
    const apiUrl = `/data/flights.json`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlights = data.filter((f) => f.id !== flight.id);
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFlights),
        });
      })
      .then(() => {
        const updatedFlights = flights.filter((f) => f.id !== flight.id);
        setFlights(updatedFlights);
      })
      .catch((error) => {});
  };

  const handleViewBookings = (flight) => {
    const apiUrl = `http://localhost:8080/api/flight/bookings`;

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": loggedInUser.token,
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => {
        const filteredBookings = data.filter(
          (booking) =>
            booking.flight.flightNumber === flight.flightNumber &&
            booking.flight.date === flight.date &&
            booking.flight.time === flight.time
        );
        setSelectedFlight(flight);
        setBookings(filteredBookings);
      })
      .catch((error) => {});
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setIsAdminLoggedIn(false);
    setSelectedFlight(null);
    setBookings([]);
  };

  const updateAvailableSeats = (flight, newAvailableSeats) => {
    const apiUrl = `/data/flights.json`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const updatedFlights = data.map((f) => {
          if (f.id === flight.id) {
            return {
              ...f,
              availableSeats: newAvailableSeats,
            };
          }
          return f;
        });
        return fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFlights),
        });
      })
      .then(() => {
        const updatedFlights = flights.map((f) => {
          if (f.id === flight.id) {
            return {
              ...f,
              availableSeats: newAvailableSeats,
            };
          }
          return f;
        });
        setFlights(updatedFlights);
      })
      .catch((error) => {});
  };
  return (
    <div>
      {loggedInUser ? (
        <>
          <h2>Welcome, {loggedInUser.username}!</h2>
          <button onClick={handleLogout}>Logout</button>
          <FlightSearchForm handleFlightSearch={handleFlightSearch} />
          {selectedFlight && (
            <BookingForm
              flight={selectedFlight}
              handleBooking={handleBooking}
            />
          )}
          <MyBookings bookings={bookings} />
          {isAdminLoggedIn ? (
            <AdminPanel
              flights={flights}
              handleAddFlight={handleAddFlight}
              handleRemoveFlight={handleRemoveFlight}
              handleViewBookings={handleViewBookings}
            />
          ) : (
            <UserPanel flights={flights} handleBooking={handleBooking} />
          )}
        </>
      ) : (
        <>
          <h2>Login</h2>
          <LoginForm handleLogin={handleUserLogin} />
          <h2>Admin Login</h2>
          <AdminLoginForm handleAdminLogin={handleAdminLogin} />
          <h2>Sign Up</h2>
          <SignUpForm handleSignUp={handleSignUp} />
        </>
      )}
    </div>
  );
};

export default App;
