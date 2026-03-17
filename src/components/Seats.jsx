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
  const [Price, setprice] = useState(0)
  const navigate = useNavigate();
  const [bus, setbus] = useState("")

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
        console.log("particular bus ", response.data)
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

  // sockets connection
  useEffect(() => {

    let socket = new WebSocket(`ws://127.0.0.1:8000/ws/bus/${id}/seats/`);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket Connected");
    };

    socket.onmessage = (event) => {

      const data = JSON.parse(event.data);
      console.log("recieve from server", data)

      setSeats(prevSeats =>
        prevSeats.map(seat =>
          seat.seat_no === data.seat_id
            ? { ...seat, seat_book: data.action === "active" }
            : seat
        )
      );

    };

    return () => socket.close();

  }, [id]);

  // Toggle seat selection
  const toggleSeat = (seat) => {

    if (seat.seat_book) return;

    const isSelected = selectedSeat.includes(seat.id);
    // busprice calculation while tog
    console.log("busprice :", bus.price)

    const newSelected = isSelected
      ? selectedSeat.filter(id => id !== seat.id)
      : [...selectedSeat, seat.id];
    console.log("toggleseat", newSelected)

    setSelectedSeat(newSelected);
    const singleSeatPrice = parseFloat(bus.price);
    const totalprice = singleSeatPrice * newSelected.length
    console.log("price", totalprice)
    setprice(totalprice)

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
      const details = res.data.bookings
      console.log("booked handle", details)
      navigate(`/bus/${id}/journeydetails`, { state: { details ,Price} })
      details.forEach((handledata) => {

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {

          socketRef.current.send(JSON.stringify({
            username: handledata.user,
            seat_id: handledata.seat.seat_no,
            action: handledata.seat.seat_book ? "active" : "inactive"
          }));

        } else {
          console.log("WebSocket not connected");
        }

      });

      // Refresh seats after booking
      const refreshed = await axios.get(`/bus/${id}/seats/`, { headers: { Authorization: `Token ${token}`, "Content-Type": "application/json", }, });
      setSeats(refreshed.data.seats);
      setSelectedSeat([]);

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
          {/* Left  */}
          <div className="col-lg-6">
            <div className="bus-cabin text-center">
              <div className="d-flex flex-wrap justify-content-center">
                {seats.map((seat) => (
                  <label key={seat.id} className="seat-container m-2">
                    <input
                      type="checkbox"
                      name="seat"
                      disabled={seat.seat_book}
                      checked={selectedSeat.includes(seat.id)}
                      onChange={() => toggleSeat(seat)}
                    />
                    <i
                      className={`fas fa-couch seat-icon ${seat.seat_book ? "sold" : ""
                        } ${selectedSeat === seat.id ? "selected" : ""}`}
                    ></i>
                    <p>{seat.seat_no}</p>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right  */}
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
                    <strong>Price : </strong>{Price}
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