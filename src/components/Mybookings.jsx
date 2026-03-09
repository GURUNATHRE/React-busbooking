import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function MyBookings() {
    const [mybookings, setmybookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access");
    const navigate = useNavigate();

    function handlenavigate(){
        navigate(`/buses`)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/list/Bookingview/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    }
                });
                const data = await response.json();
                // Ensure we are setting an array even if the key is missing
                setmybookings(data.bookings || []);
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    return (
        <div style={{ backgroundColor: "#dad3d0", minHeight: "100vh" }}>
            <Navbar />
            
            <div className="container py-5 ">
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: "#2d3436" }}>Your Journey History</h2>
                    <p className="text-muted">Manage and view all your ticket reservations in one place.</p>
                </div>

                <div className="row justify-content-center" >
                    <div className="col-lg-8">
                        {loading ? (
                            <div className="text-center mt-5">
                                <div className="spinner-border text-primary" role="status"></div>
                            </div>
                        ) : mybookings.length > 0 ? (
                            mybookings.map((booked) => (
                                <div key={booked.id} className="card border-0 shadow-sm mb-4 overflow-hidden" style={{ borderRadius: "15px" ,backgroundColor: "#6f7d94"}}>
                                    <div className="row g-0"  >
                                        {/* Left Side Accent */}
                                        <div className="col-md-1 bg-primary d-none d-md-flex align-items-center justify-content-center">
                                            <i className="bi bi-ticket-perforated text-white fs-3"></i>
                                        </div>
                                        
                                        <div className="col-md-11" style={{ color: "#0c0d0e" }}>
                                            <div className="card-body p-4"  >
                                                <div className="d-flex justify-content-between align-items-start mb-3">
                                                    <div>
                                                        <span className="badge bg-soft-primary text-primary mb-2" style={{ backgroundColor: "#e2e5e9" }}>Confirmed</span>
                                                        <h4 className="card-title fw-bold mb-0">{booked.bus}</h4>
                                                    </div>
                                                </div>

                                                <hr className="text-muted opacity-25" />

                                                <div className="row text-center text-md-start">
                                                    <div className="col-6 col-md-3 mb-3 mb-md-0">
                                                        <small className="text-muted d-block text-uppercase small fw-semibold">Seat Number</small>
                                                        <span className="fw-bold fs-5 text-dark">{booked.seat.seat_no}</span>
                                                    </div>
                                                    <div className="col-6 col-md-3 mb-3 mb-md-0">
                                                        <small className="text-muted d-block text-uppercase small fw-semibold">Bus ID</small>
                                                        <span className="fw-bold fs-5 text-dark">{booked.seat.bus}</span>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <small className="text-muted d-block text-uppercase small fw-semibold">Passenger</small>
                                                        <span className="fw-medium text-dark">{booked.user}</span>
                                                    </div>
                                                    <div className="col-6 col-md-3">
                                                        <small className="text-muted d-block text-uppercase small fw-semibold">Date</small>
                                                        <span className="fw-medium text-dark">{new Date(booked.booking).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Empty State */
                            <div className="text-center bg-white shadow-sm p-5" style={{ borderRadius: "20px" }}>
                                <div className="mb-4">
                                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: "4rem" }}></i>
                                </div>
                                <h4 className="fw-bold">No bookings found</h4>
                                <p className="text-muted px-md-5">It looks like you haven't planned any trips yet. Explore our buses and start your adventure!</p>
                                <button className="btn btn-primary px-4 py-2 mt-3 shadow-sm" style={{ borderRadius: "10px" }} onClick={handlenavigate}>
                                    Book a Ticket Now
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyBookings;