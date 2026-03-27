import React, { useState, useEffect, useRef } from "react";
import "../css/Seats.css";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Seats() {
  const { id } = useParams();

  const [seats, setSeats] = useState([]);
  const socketRef = useRef(null);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [Price, setprice] = useState(0);
  const navigate = useNavigate();
  const [bus, setbus] = useState("");

  const token = localStorage.getItem("access");

  // particular bus
  useEffect(() => {
    const fetchbus = async () => {
      try {
        const response = await axios.get(`buses/${id}`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });
        setbus(response.data);
      } catch (error) {
        console.error("Error fetching bus:", error);
      }
    };
    fetchbus();
  }, [id, token]);

  // seats for the bus
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const res = await axios.get(`bus/${id}/seats/`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setSeats(res.data.seats);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, [id, token]);

  // WebSocket connection
  useEffect(() => {
    let socket = new WebSocket(`ws://127.0.0.1:8000/ws/bus/${id}/seats/`);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket Connected");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.seat_no === data.seat_id
            ? {
              ...seat,
              seat_book: data.action === "active" ? true : seat.seat_book,
              seat_hold: data.action === "hold" ? true : data.action === "release" ? false : seat.seat_hold,
            }
            : seat
        )
      );
    };

    return () => socket.close();
  }, [id]);

  // Fixed Toggle Logic
  const toggleSeat = (seat) => {
    if (seat.seat_book || (seat.seat_hold && !selectedSeat.some(s => s.id === seat.id))) return;

    const isSelected = selectedSeat.some(s => s.id === seat.id);
    const newSelected = isSelected
      ? selectedSeat.filter(s => s.id !== seat.id)
      : [...selectedSeat, seat];

    setSelectedSeat(newSelected);
    setprice(parseFloat(bus.price || 0) * newSelected.length);

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        seat_id: seat.seat_no,
        action: isSelected ? "release" : "hold",
      }));
    }
  };

  const handleProceedToPayment = () => {
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    selectedSeat.forEach(seat => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          seat_id: seat.seat_no,
          action: "release",
        }));
      }
    });

    navigate(`/bus/${id}/journeydetails`, {
      state: {
        selectedSeatIds: selectedSeat.map(s => s.id),
        selectedSeatNos: selectedSeat.map(s => s.seat_no),
        Price,
        busId: id,
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="seats-wrapper">
        <div className="container py-4">

          {/* Header Section with Back Button */}
          <div className="d-flex align-items-center mb-4 position-relative">
            <button
              className="btn btn-outline-light shadow-sm d-flex align-items-center justify-content-center"
              onClick={() => navigate("/buses")}
              style={{
                width: "45px",               // Fixed width
                height: "45px",              // Fixed height
                borderRadius: "50%",         // Perfect circle
                backdropFilter: 'blur(8px)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                padding: "0",                // Remove default padding to center the icon
                transition: "all 0.3s ease"
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>

            <h2 className="text-center flex-grow-1 m-0 fw-bold text-white" style={{ marginRight: '80px' }}>
              Select Your Seats
            </h2>
          </div>

          <div className="row">
            <div className="col-lg-6">
              <div className="mb-4">
                <div className="bus-cabin">
                  <div className="steering-section">
                    <i className="fas fa-dharmachakra fa-2x"></i>
                  </div>

                  <div className="seats-grid">
                    {seats.map((seat, index) => {
                      const isMySelected = selectedSeat.some(s => s.id === seat.id);
                      const isBooked = seat.seat_book;
                      const isHeld = seat.seat_hold && !isMySelected;

                      return (
                        <React.Fragment key={seat.id}>
                          <div
                            className="seat-container"
                            onClick={() => toggleSeat(seat)}
                          >
                            <i className={`fas fa-couch seat-icon
                            ${isBooked ? "sold" : ""}
                            ${isHeld ? "held" : ""}
                            ${isMySelected ? "selected" : ""}
                        `}></i>
                            <p>{seat.seat_no}</p>
                          </div>

                          {/* Injects the aisle empty space after every 2 seats in a row of 4 */}
                          {(index + 1) % 2 === 0 && (index + 1) % 4 !== 0 && <div className="aisle-space"></div>}
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="glass-card shadow-lg p-4 trip-card">

                <h3 className="fw-bold mb-3 border-bottom pb-2">
                  Trip Details
                </h3>

                {selectedSeat.length > 0 ? (
                  <div className="trip-info">

                    <p><strong><i className="fa-solid fa-bus"></i> Bus:</strong> {bus.bus_name} ({bus.bus_number})</p>

                    <p><strong><i className="fa-solid fa-route"></i>Route:   </strong>
                      <span className="text-primary">{bus.starting_point}</span> →
                      <span className="text-primary"> {bus.ending_points}</span>
                    </p>

                    <p><strong><i className="fa-solid fa-star"></i> Features:</strong> {bus.features}</p>

                    <div className="d-flex justify-content-between mt-3">
                      <div>
                        <small className="text-muted">Departure</small>
                        <div className="fw-bold">{bus.start_time}</div>
                      </div>
                      <div className="text-end">
                        <small className="text-muted">Arrival</small>
                        <div className="fw-bold">{bus.reach_time}</div>
                      </div>
                    </div>

                    <hr />

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fs-5 fw-semibold">Total Price</span>
                      <span className="fs-4 fw-bold text-success">₹{Price}</span>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    Please select a seat
                  </div>
                )}

                <button
                  className="btn btn-primary w-100 mt-4 fw-bold pay-btn"
                  onClick={handleProceedToPayment}
                  disabled={selectedSeat.length === 0}
                >
                  Proceed to Payment
                </button>
              </div>

              {/* Legend */}
              <div className="legend mt-3 p-3 shadow-lg rounded d-flex justify-content-between align-items-center"
                style={{ background: 'rgba(255, 255, 255, 0.66)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>

                {/* Left Side */}
                <span className="text-white small">
                  <i className="fas fa-couch me-2"></i>Available
                </span>

                {/* Middle Items */}
                <div className="d-flex gap-5 ">
                  <span className="text-success small">
                    <i className="fas fa-couch me-1"></i>Selected
                  </span>
                  <span className="text-warning small">
                    <i className="fas fa-couch me-1"></i>Hold
                  </span>
                </div>

                {/* Right Side */}
                <span className="text-danger small">
                  <i className="fas fa-couch me-2"></i>Sold
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seats;