import React, { useState, useEffect, useRef } from "react";
import "../css/Seats.css";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { set } from "react-hook-form";
function Seats() {
  const { id } = useParams();
  const location = useLocation();
  const queryJourneyDate = new URLSearchParams(location.search).get("date");
  const journeyDate = location.state?.journeyDate || queryJourneyDate;

  const [seats, setSeats] = useState([]);
  const socketRef = useRef(null);
  const [selectedSeat, setSelectedSeat] = useState([]);
  const [Price, setprice] = useState(0);
  const navigate = useNavigate();
  const [bus, setbus] = useState("");

  // womens
  const [seatMap, setSeatMap] = useState({});

  const token = sessionStorage.getItem("access") || localStorage.getItem("access"); // Fallback to localStorage
  const currentUser = sessionStorage.getItem("username") || localStorage.getItem("username") || "anonymous";
  const currentUserGender = "Male";
  // particular bus 
  useEffect(() => {
    const fetchbus = async () => {
      try {
        const response = await axios.get(`buses/${id}/`, {
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


  // booking view for the particular bus — builds seatMap for women reservation
  useEffect(() => {
    const fetchbookingview = async () => {
      try {
        const query = journeyDate ? `?date=${encodeURIComponent(journeyDate)}` : "";
        const response = await axios.get(`bookings/${id}/bus/${query}`, {
          headers: {
            Authorization: `Token ${token}`,
            "Content-Type": "application/json",
          },
        });

        const map = {};
        response.data.all_seat_assignments?.forEach(item => {
          map[item.seat.seat_no] = {
            gender: item.travelers?.[0]?.gender || "Unknown"
          };
        });
        setSeatMap(map);

      } catch (error) {
        console.error("Error fetching booking view:", error);
      }
    };

    fetchbookingview();
  }, [id, token, journeyDate]);


  // seats for the bus 
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const query = journeyDate ? `?date=${encodeURIComponent(journeyDate)}` : "";
        const res = await axios.get(`bus/${id}/seats/${query}`, {
          headers: { Authorization: `Token ${token}`, "Content-Type": "application/json" },
        });
        setSeats(res.data.seats);
      } catch (error) {
        console.error("Error fetching seats:", error);
      }
    };
    fetchSeats();
  }, [id, token, journeyDate]);

  // WebSocket connection 
  useEffect(() => {
    let socket = new WebSocket(`ws://127.0.0.1:8000/ws/bus/${id}/seats/`);
    socketRef.current = socket;

    socket.onopen = () => console.log("WebSocket Connected");
    socket.onerror = (error) => console.error("WebSocket Error:", error);
    socket.onclose = (event) => console.log("WebSocket Closed", event.code, event.reason);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      
      // Update seats state
      setSeats(prevSeats =>
        prevSeats.map(seat => {
          const seatNo = Number(seat.seat_no);
          const incomingSeatId = Number(data.seat_id);
          if (seatNo !== incomingSeatId) return seat;

          console.log(`Updating seat ${seatNo} with action: ${data.action}`);
          switch (data.action) {
            case "active":
              return { ...seat, seat_book: true, seat_hold: false };
            case "inactive":
              return { ...seat, seat_book: false, seat_hold: false };
            case "hold":
              return { ...seat, seat_book: false, seat_hold: true };
            case "release":
              return { ...seat, seat_book: false, seat_hold: false };
            default:
              return seat;
          }
        })
      );

      // Also update seatMap when seat is booked by another user
      if (data.action === "active") {
        setSeatMap(prevMap => ({
          ...prevMap,
          [data.seat_id]: {
            gender: "Unknown", // Will be updated on next fetch if needed
            booked: true
          }
        }));
        console.log(`Seat ${data.seat_id} marked as booked by ${data.username}`);
      }
    };

    return () => socket.close();
  }, [id]);

  //  Get the buddy seat number in the same pair (2-2 layout)
  // Row of 4: positions 0,1 = left pair | positions 2,3 = right pair
  const getBuddySeatNo = (seatNo) => {
    const pos = (seatNo - 1) % 4; // 0,1,2,3
    if (pos === 0) return seatNo + 1; 
    if (pos === 1) return seatNo - 1; 
    if (pos === 2) return seatNo + 1; 
    return seatNo - 1;                
  };

  //  Determine the women-related CSS class for a seat icon
  const getWomenClass = (seatNo) => {
    const current = seatMap[seatNo];

    //  Seat booked by a female traveler
    if (current?.gender === "Female") {
      return "women-booked";
    }

    //  Buddy seat of a female — reserved for women (only if seat is NOT already booked)
    const buddyNo = getBuddySeatNo(seatNo);
    const buddy = seatMap[buddyNo];
    if (buddy?.gender === "Female" && !current) {
      return "women-adjacent";
    }

    return "";
  };
  // Fixed Toggle - Select seats for current user only (no WebSocket hold)
  const toggleSeat = (seat) => {
    // Block if seat is already booked by someone
    if (seat.seat_book) {
      alert("This seat is already booked!");
      return;
    }

    // Block if seat is held by someone else (during their checkout)
    if (seat.seat_hold) {
      alert("This seat is being checked out by another user. Please try again.");
      return;
    }

    const isSelected = selectedSeat.some(s => s.id === seat.id);
    if (!isSelected && selectedSeat.length >= 5) {
      alert("You can only book a maximum of 5 seats.");
      return;
    }

    const newSelected = isSelected
      ? selectedSeat.filter(s => s.id !== seat.id)
      : [...selectedSeat, seat];

    setSelectedSeat(newSelected);
    setprice(parseFloat(bus.price || 0) * newSelected.length);

    // NOTE: We do NOT hold the seat on WebSocket here. 
    // Hold will be triggered only after successful payment in journey details.
    // This prevents blocking seats for other users until actual booking.
  };

  const handleProceedToPayment = () => {
    if (!token) {
      alert("You are not logged in!");
      return;
    }

    navigate(`/bus/${id}/journeydetails`, {
      state: {
        selectedSeatIds: selectedSeat.map(s => s.id),
        selectedSeatNos: selectedSeat.map(s => s.seat_no),
        Price,
        busId: id,
        journeyDate
      }
    });
  };

  return (
    <>
      <Navbar />
      <div className="seats-wrapper py-5">
        <div className="container py-5">
          <div className="d-flex align-items-center mb-5 position-relative" style={{ marginLeft: '18%', transition: 'all 0.3s ease' }}>
            <button
              className="btn back-btn-orange shadow"
              onClick={() => navigate(-1)}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h2 className="fw-bold text-black ms-5 ps-3">Select Your Seats</h2>
          </div>

          <div className="row justify-content-center">
            {/* LEFT COLUMN: Bus Cabin Structure */}
            <div className="col-lg-5 d-flex flex-column align-items-center">
              <div className="bus-chassis shadow-lg">
                <div className="bus-front">
                  <i className="fas fa-dharmachakra steering-wheel" style={{ color: "#f39e4f", paddingBottom: "20px", fontSize: "2rem" }}></i>
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

                        <div className={`seat-wrapper ${getWomenClass(seat.seat_no)}`} onClick={() => toggleSeat(seat)}>
                          <i className={`fas fa-couch seat-icon 
            ${isBooked ? "sold" : ""} 
            ${isHeld ? "held" : ""} 
            ${isMySelected ? "selected" : ""}
            ${getWomenClass(seat.seat_no)}`}
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
                  <div className="icon-box text-white rounded-3 p-3 me-3 shadow-sm" style={{ backgroundColor: "#da863c" }}>
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
                          <span
                            key={index}
                            className="badge border fw-medium rounded-pill px-3 py-2 shadow-sm"
                            style={{ color: '#e4a65e', borderColor: "#000000" }}
                          >
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
                <div className="legend-item"><span className="dot wmn"></span> Women</div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Seats;