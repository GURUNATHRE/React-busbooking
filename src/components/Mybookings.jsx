import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import html2pdf from "html2pdf.js";

function MyBookings() {
    const [mybookings, setmybookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem("access");
    const navigate = useNavigate();

    const handleDownload = (id) => {
        const element = document.getElementById(`ticket-${id}`);

        const opt = {
            margin: 0.3,
            filename: `ticket-${id}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(element).save();
    };
    // Navigation logic for empty state
    function handlenavigate() {
        navigate(`/buses`);
    }
    // Fetch Logic
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
        <div style={{ backgroundColor: "#f8f1eb", minHeight: "100vh" }}>
            <Navbar />

            <div className="container py-5">
                {/* Header Section */}
                <div className="text-center mb-5">
                    <h2 className="fw-bold" style={{ color: "#2d3436", fontSize: "2.5rem" }}>Your Journey History</h2>
                    <p className="text-muted">Manage and view all your ticket reservations in one place.</p>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-9">
                        {loading ? (
                            <div className="text-center mt-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : mybookings.length > 0 ? (
                            mybookings.map((booked) => (
                                <div id={`ticket-${booked.id}`} key={booked.id} className="position-relative mb-4">
                                    <div
                                        className="card border-0 shadow-sm"
                                        style={{ borderRadius: "20px", overflow: "hidden", borderLeft: "8px solid #007bff" }}
                                    >
                                        <div className="card-body p-0">
                                            <div className="row g-0">
                                                {/* Main Ticket Info (Left) */}
                                                <div className="col-md-8 p-4">
                                                    <div className="d-flex align-items-center gap-2 mb-3">
                                                        <span className="badge rounded-pill text-success px-3" style={{ backgroundColor: "#e8f5e9" }}>
                                                            ● Confirmed
                                                        </span>
                                                        <span className="text-muted small">Booking ID: #{booked.id}</span>
                                                    </div>

                                                    <div className="d-flex align-items-center gap-3 mb-4">
                                                        <div className="p-3 bg-primary text-white rounded-circle">
                                                            <DirectionsBusIcon />
                                                        </div>
                                                        <div>
                                                            <h4 className="fw-bold mb-0 text-dark">{booked.bus}</h4>
                                                            <small className="text-muted">Bus Ref: {booked.seat.bus}</small>
                                                        </div>
                                                    </div>

                                                    <div className="row g-3">
                                                        <div className="col-4">
                                                            <p className="text-muted mb-0 small text-uppercase fw-bold">Seat</p>
                                                            <p className="fw-bold fs-5 text-primary mb-0">{booked.seat.seat_no}</p>
                                                        </div>
                                                        <div className="col-4 border-start border-end px-3">
                                                            <p className="text-muted mb-0 small text-uppercase fw-bold">Date</p>
                                                            <p className="fw-bold mb-0 text-dark">{new Date(booked.booking).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="col-4">
                                                            <p className="text-muted mb-0 small text-uppercase fw-bold">Passenger</p>
                                                            <p className="fw-bold mb-0 text-truncate text-dark">{booked.user}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Ticket Stub (Right) */}
                                                <div className="col-md-4 bg-light p-4 d-flex flex-column justify-content-center align-items-center text-center"
                                                    style={{ borderLeft: "2px dashed #dee2e6" }}>
                                                    <div className="mb-3">
                                                        <small className="text-muted d-block mb-2">Scan for Entry</small>
                                                        <img
                                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${window.location.origin}/mybookings/${booked.id}`}
                                                            alt="QR Code"
                                                            className="img-fluid"
                                                            style={{ mixBlendMode: "multiply" }}
                                                        />
                                                    </div>
                                                    {/* Button remains visible but currently has no function attached */}
                                                    <button
                                                        onClick={() => handleDownload(booked.id)}
                                                        className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2 rounded-pill px-3 fw-bold"
                                                    >
                                                        <DownloadForOfflineIcon fontSize="small" />
                                                        Download PDF
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center bg-white shadow-sm p-5 rounded-4">
                                <div className="mb-4">
                                    <i className="bi bi-calendar-x text-muted" style={{ fontSize: "4rem" }}></i>
                                </div>
                                <h4 className="fw-bold">No bookings found</h4>
                                <p className="text-muted px-md-5">It looks like you haven't planned any trips yet.</p>
                                <button className="btn btn-primary px-4 py-2 mt-3 shadow-sm rounded-pill" onClick={handlenavigate}>
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