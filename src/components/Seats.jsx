import React, { useState, useEffect } from "react";
import "../css/Seats.css";
import { useParams, useLocation, useNavigation, data } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Seats() {
  const { id } = useParams();

  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const navigate = useNavigate();
  const [bus, setbus] = useState("")

  const token = localStorage.getItem("access");
  useEffect(() => {
    const fetchbus = async () => {
      try {
        const response = await axios.get(`buses/${id}`);
        setbus(response.data)
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchbus();
  }, [id]);
  //  seats for the bus
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`bus/${id}/seats/`, { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json", }, });
        setSeats(res.data.seats);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };

    fetchSeats();
  }, [id]);

  // Toggle seat selection
  const toggleSeat = (seat) => {
    if (seat.seat_book) return;

    setSelectedSeat((prev) =>
      prev.includes(seat.id)
        ? prev.filter((id) => id !== seat.id)
        : [...prev, seat.id]
    );
  };

  // Handle booking
  const handleBooking = async () => {
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    try {
      const res = await axios.post(`Bookingview/`, { seat: selectedSeat, }, { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json", }, });

      alert("Seat booked successfully!");
      const details = res.data
      navigate(`/mybookings`, { state: { details } })


      // Refresh seats after booking
      const refreshed = await axios.get(`/bus/${id}/seats/`, { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json", }, });
      setSeats(refreshed.data.seats);
      setSelectedSeat(null);

    } catch (error) {
      console.error("Booking error:", error.response?.data);
      alert("Seat already booked or authentication error");
    }
  };


  return (
    <>
      <Navbar />
      <div className="container py-5">
        <h2 className="text-center mb-4">Select Your Seats</h2>
        <div className="row">
          {/* Left - Seats */}
          <div className="col-lg-6">
            <div className="bus-cabin text-center">
              <div className="d-flex flex-wrap justify-content-center">
                {seats.map((seat) => (
                  <label key={seat.seat_no} className="seat-container m-2">
                    <input
                      type="checkbox"
                      name="seat"
                      disabled={seat.seat_book}
                      checked={selectedSeat.includes(seat.id)}
                      onChange={() => toggleSeat(seat)}
                    />
                    <i
                      className={`fas fa-couch seat-icon ${seat.seat_book ? "sold" : ""
                        } ${selectedSeat === seat.seat_no ? "selected" : ""}`}
                    ></i>
                    <p>{seat.seat_no}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Trip Details */}
          <div className="col-lg-5">
            <div className="glass-card shadow-lg p-4">
              <h3>Trip Details</h3>
              {selectedSeat && (
                <>
                  <p>
                    <strong>Name :</strong> {bus.bus_name}
                  </p>
                  <p>
                    <strong>Number :</strong> {bus.bus_number}
                  </p>
                  <p>
                    <strong>Starting point :</strong> {bus.starting_point}
                  </p>
                  <p>
                    <strong>Ending point :</strong> {bus.ending_points}
                  </p>
                  <p>
                    <strong>Features :</strong> {bus.features}
                  </p>
                  <p>
                    <strong>Starting time :</strong> {bus.start_time}
                  </p>
                  <p>
                    <strong>Reaching  time :</strong> {bus.reach_time}
                  </p>
                  <p>
                    <strong>Price : </strong>{bus.price}
                  </p>

                </>
              )}
              {/* <p>
                <strong>Selected Seat:</strong>{" "}
                {selectedSeat ? selectedSeat : "None"}
              </p> */}
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleBooking}
                disabled={!selectedSeat}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seats;