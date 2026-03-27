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

  // particular bus logic (Unchanged)
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

  // seats for the bus logic (Unchanged)
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

  // WebSocket connection logic (Unchanged)
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

  // Fixed Toggle Logic (Unchanged)
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
          <div className="d-flex align-items-center mb-5 position-relative" style={{ marginLeft: '19%', transition: 'all 0.3s ease' }}>
            <button
              className="btn back-btn-orange shadow"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="fw-bold text-black ms-5 m-0">Select Your Seats</h2>
          </div>

          <div className="row justify-content-center g-5">
            {/* LEFT COLUMN: Bus Cabin Structure */}
            <div className="col-lg-5 d-flex flex-column align-items-center">
              <div className="bus-chassis shadow-lg">
                <div className="bus-front">
                  <i className="fas fa-dharmachakra steering-wheel"></i>
                </div>

                <div className="seats-grid-layout">
                  {seats.map((seat, index) => {
                    const isMySelected = selectedSeat.some(s => s.id === seat.id);
                    const isBooked = seat.seat_book;
                    const isHeld = seat.seat_hold && !isMySelected;

                    return (
                      <React.Fragment key={seat.id}>
                        {/* Adds the empty space for the aisle after 2 seats */}
                        {index % 4 === 2 && <div className="aisle-gap"></div>}

                        <div className="seat-wrapper" onClick={() => toggleSeat(seat)}>
                          <i className={`fas fa-couch seat-icon 
            ${isBooked ? "sold" : ""} 
            ${isHeld ? "held" : ""} 
            ${isMySelected ? "selected" : ""}`}
                          ></i>
                          <span className="seat-number">{seat.seat_no}</span>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Trip Details & Legend */}
            <div className="col-lg-5">
              <div className="glass-card shadow-lg p-4 trip-card border-0 rounded-4 overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
                <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-light-subtle">
                  <div className="icon-box text-white rounded-3 p-3 me-3 shadow-sm" style={{backgroundColor:"#da863c"}}>
                    <i className="fa-solid fa-receipt fs-4"></i>
                  </div>
                  <div>
                    <h3 className="fw-black mb-0 text-dark tracking-tight" style={{ fontSize: '1.5rem' }}>
                      Trip Summary
                    </h3>
                    <p className="text-muted small mb-0 fw-medium">Review your journey details</p>
                  </div>
                </div>

                {selectedSeat.length > 0 ? (
                  <div className="trip-info p-4 bg-white rounded-4 shadow-sm border">
                    {/* 1. Header: Bus Name & Identity */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div>
                        <h6 className="text-muted small text-uppercase fw-bold mb-1 tracking-wider" style={{ letterSpacing: '1px' }}>
                          Operator
                        </h6>
                        <h5 className="fw-extrabold text-dark mb-0">
                          <i className="fa-solid fa-bus text-orange me-2"></i>
                          {bus.bus_name}
                          <span className="text-muted ms-2 fw-normal fs-6">({bus.bus_number})</span>
                        </h5>
                      </div>
                      <div className="text-end">
                        <span className="custom-express-badge badge  rounded-pill px-3 py-2">Express</span>
                      </div>
                    </div>

                    {/* 2. Route & Time (The "Ticket" Section) */}
                    <div className="position-relative d-flex justify-content-between align-items-center bg-light p-4 rounded-4 mb-4">
                      <div className="text-start">
                        <p className="text-muted small fw-bold text-uppercase mb-1">Departure</p>
                        <h4 className="fw-black mb-0 text-primary">{bus.start_time}</h4>
                        <p className="fw-bold mb-0 text-dark">{bus.starting_point}</p>
                      </div>

                      {/* Decorative Route Line */}
                      <div className="flex-grow-1 px-3 d-none d-md-block">
                        <div className="d-flex align-items-center">
                          <div className="rounded-circle bg-primary" style={{ width: '8px', height: '8px' }}></div>
                          <div className="border-top border-2 flex-grow-1 border-dashed"></div>
                          <i className="fas fa-chevron-right text-muted mx-2 small"></i>
                          <div className="border-top border-2 flex-grow-1 border-dashed"></div>
                          <div className="rounded-circle border border-primary bg-white" style={{ width: '8px', height: '8px' }}></div>
                        </div>
                      </div>

                      <div className="text-end">
                        <p className="text-muted small fw-bold text-uppercase mb-1">Arrival</p>
                        <h4 className="fw-black mb-0 text-dark">{bus.reach_time}</h4>
                        <p className="fw-bold mb-0 text-dark">{bus.ending_points}</p>
                      </div>
                    </div>

                    {/* 3. Amenities (Modern Chips) */}
                    <div className="mb-4">
                      <p className="text-muted small fw-bold text-uppercase mb-2">Service Amenities</p>
                      <div className="d-flex flex-wrap gap-2">
                        {bus.features.split(',').map((item, index) => (
                          <span key={index} className="badge border text-secondary fw-medium rounded-pill px-3 py-2 bg-white shadow-sm">
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 4. Pricing Footer */}
                    <div className="d-flex justify-content-between align-items-end pt-3 border-top">
                      <div>
                        <p className="text-muted small mb-0">Price per passenger</p>
                        <span className="fs-6 fw-bold text-muted">Inclusive of taxes</span>
                      </div>
                      <div className="text-end">
                        <span className="fs-2 fw-black text-success d-block">₹{Price}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="mb-3 text-muted opacity-25">
                      <i className="fas fa-couch fa-3x"></i>
                    </div>
                    <h4 className="text-muted">No seats selected yet</h4>
                  </div>
                )}

                <button
                  className="btn btn-primary btn-lg w-100 mt-4 fw-bold pay-btn shadow"
                  onClick={handleProceedToPayment}
                  disabled={selectedSeat.length === 0}
                >
                  Confirm Selection
                </button>
              </div>

              {/* Enhanced Legend */}
              <div className="legend-pills mt-4 shadow-sm">
                <div className="legend-item"><span className="dot avail"></span> Available</div>
                <div className="legend-item"><span className="dot selected-dot"></span> Selected</div>
                <div className="legend-item"><span className="dot held-dot"></span> Hold</div>
                <div className="legend-item"><span className="dot sld"></span> Sold</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seats;