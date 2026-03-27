import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const TIMER_SECONDS = 3 * 60; // 3 minutes

function Carddetails() {
    const location = useLocation();
    const navigate = useNavigate();

    // All data passed from Paymentprocess
    const { selectedSeatIds, selectedSeatNos, travelers, Price, finalPrice, busId } = location.state || {};

    const [cardNumber, setCardNumber] = useState("");
    const [expMonth, setExpMonth] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [expired, setExpired] = useState(false);

    const socketRef = useRef(null);
    const token = localStorage.getItem("access");

    // Load Accept.js
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://jstest.authorize.net/v1/Accept.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    // WebSocket for sending booking confirmation
    useEffect(() => {
        if (!busId || busId === "undefined") return;

        console.log(`Connecting to WebSocket: ws://127.0.0.1:8000/ws/bus/${busId}/seats/`);
        const socket = new WebSocket(`ws://127.0.0.1:8000/ws/bus/${busId}/seats/`);
        socketRef.current = socket;

        socket.onopen = () => console.log("WebSocket Connected ✅");
        socket.onerror = (e) => console.error("WebSocket Error ❌:", e);
        socket.onclose = () => console.log("WebSocket Closed 🔒");

        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, [busId]);

    // 3-minute countdown timeran
    useEffect(() => {
        if (expired) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [expired]);

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, "0");
        const s = (secs % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const timerColor = timeLeft <= 30 ? "#dc3545" : timeLeft <= 60 ? "#fd7e14" : "#198754";

    // Called only after payment success
    const createBookingAndNotify = async () => {
        try {
            const res = await fetch("http://127.0.0.1:8000/list/Bookingview/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({ seat: selectedSeatIds })
            });

            if (!res.ok) throw new Error("Booking API failed");

            const data = await res.json();
            const bookings = data.bookings;

            // Now send socket messages to update other users
            bookings.forEach((handledata) => {
                if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify({
                        username: handledata.user,
                        seat_id: handledata.seat.seat_no,
                        action: handledata.seat.seat_book ? "active" : "inactive"
                    }));
                }
            });

            return bookings;
        } catch (error) {
            console.error("Booking error:", error);
            throw error;
        }
    };

    const handlePayment = () => {
        if (expired) {
            setMessage("Session expired. Please go back and select seats again.");
            return;
        }

        setLoading(true);
        setMessage("");

        if (!window.Accept) {
            setMessage("Payment library not loaded yet. Please try again.");
            setLoading(false);
            return;
        }

        const authData = {
            apiLoginID: "73PHr3Jzuea",
            clientKey: "4h7E8M644vYTY69jUfT2LaZA5c2fZycqSugLsxYh53Tnu7rEnG27Ku354776TGEd"
        };

        const cardData = {
            cardNumber,
            month: expMonth,
            year: expYear,
            cardCode: cvv
        };

        window.Accept.dispatchData({ authData, cardData }, async function (response) {
            if (response.messages.resultCode === "Ok") {
                const opaqueData = response.opaqueData;

                try {
                    // Step 1: Process payment
                    const payRes = await fetch("http://127.0.0.1:8000/list/api/pay/", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Token ${token}`
                        },
                        body: JSON.stringify({ opaquedata: opaqueData, amount: finalPrice })
                    });
                    const payData = await payRes.json();

                    if (!payRes.ok) throw new Error(payData.message || "Payment failed");

                    // Step 2: Payment success → now create booking
                    await createBookingAndNotify();

                    setMessage("🎉 Congratulations! Your booking is confirmed. Redirecting to your bookings...");
                    setLoading(false);

                    // Wait 3 seconds then go to My Bookings
                    setTimeout(() => {
                        navigate("/mybookings");
                    }, 3000);

                } catch (err) {
                    console.error(err);
                    setMessage("Error: " + err.message);
                    setLoading(false);
                }
            } else {
                const errorMsg = response.messages.message[0].text;
                setMessage("Payment failed: " + errorMsg);
                setLoading(false);
            }
        });
    };

    return (
        <>
            <Navbar />
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-4">

                                <h3 className="text-center mb-2">💳 Secure Payment</h3>

                                {/* Timer */}
                                <div
                                    className="text-center mb-3 py-2 rounded-3"
                                    style={{ backgroundColor: expired ? "#f8d7da" : "#f0fff4", border: `2px solid ${timerColor}` }}
                                >
                                    {expired ? (
                                        <div>
                                            <span style={{ color: "#dc3545", fontWeight: "bold", fontSize: "1rem" }}>
                                                ⏰ Session Expired
                                            </span>
                                            <p className="text-danger small mb-0">Your seat hold has expired. Please go back and reselect.</p>
                                        </div>
                                    ) : (
                                        <div>
                                            <span style={{ color: timerColor, fontWeight: "bold", fontSize: "1.4rem" }}>
                                                ⏱ {formatTime(timeLeft)}
                                            </span>
                                            <p className="mb-0 small text-muted">Complete payment before time runs out</p>
                                        </div>
                                    )}
                                </div>

                                {/* Fare summary */}
                                <div className="bg-light rounded-3 p-3 mb-3">
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted small">Seats</span>
                                        <span className="fw-bold small">{selectedSeatNos?.join(", ")}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mt-1">
                                        <span className="text-muted small">Amount to Pay</span>
                                        <span className="fw-bold text-success">₹{finalPrice}</span>
                                    </div>
                                </div>

                                {/* Card Number */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Card Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={cardNumber}
                                        onChange={e => setCardNumber(e.target.value)}
                                        placeholder="1234 5678 9012 3456"
                                        disabled={expired}
                                        maxLength={16}
                                    />
                                </div>

                                {/* Expiry */}
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label fw-bold">Month</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={expMonth}
                                            onChange={e => setExpMonth(e.target.value)}
                                            placeholder="MM"
                                            disabled={expired}
                                            maxLength={2}
                                        />
                                    </div>
                                    <div className="col">
                                        <label className="form-label fw-bold">Year</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={expYear}
                                            onChange={e => setExpYear(e.target.value)}
                                            placeholder="YYYY"
                                            disabled={expired}
                                            maxLength={4}
                                        />
                                    </div>
                                </div>

                                {/* CVV */}
                                <div className="mt-3">
                                    <label className="form-label fw-bold">CVV</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={cvv}
                                        onChange={e => setCvv(e.target.value)}
                                        placeholder="123"
                                        disabled={expired}
                                        maxLength={4}
                                    />
                                </div>

                                {/* Pay Button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={loading || expired}
                                    className="btn btn-success w-100 mt-4 fw-bold py-2"
                                >
                                    {loading ? "Processing..." : `Pay ₹${finalPrice}`}
                                </button>

                                {/* Go back if expired */}
                                {expired && (
                                    <button
                                        className="btn btn-outline-secondary w-100 mt-2"
                                        onClick={() => navigate(-2)}
                                    >
                                        Go Back & Reselect Seats
                                    </button>
                                )}

                                {message && (
                                    <div className={`alert mt-3 text-center ${message.includes("successful") ? "alert-success" : "alert-danger"}`}>
                                        {message}
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Carddetails;