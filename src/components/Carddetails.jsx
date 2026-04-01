import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useParams } from "react-router-dom";

const TIMER_SECONDS = 3 * 60;

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .carddetails-root {
    background: #f0f4f8;
    min-height: 100vh;
    padding: 40px 0 60px;
    font-family: 'DM Sans', sans-serif;
  }

  .carddetails-back-row {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 28px;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
    padding: 0 16px;
  }

  .carddetails-back-btn {
    background: #eba554;
    color: #ffffff;
    width: 44px;
    height: 44px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
    transition: background 0.2s, box-shadow 0.2s;
    flex-shrink: 0;
  }
  .carddetails-back-btn:hover {
    background: #e19442;
  }

  .carddetails-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a2e;
    margin: 0;
    letter-spacing: -0.3px;
  }

  .carddetails-card {
    background: #ffffff;
    border-radius: 20px;
    padding: 32px 30px 28px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04);
    max-width: 480px;
    margin: 0 auto;
    border: 1px solid #e8edf3;
  }

  .carddetails-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-bottom: 22px;
  }

  .carddetails-header-icon {
    font-size: 22px;
  }

  .carddetails-header-text {
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
    letter-spacing: -0.3px;
  }

  /* Timer */
  .carddetails-timer {
    border-radius: 12px;
    text-align: center;
    padding: 14px 16px;
    margin-bottom: 20px;
    transition: all 0.4s;
  }
  .carddetails-timer.green {
    background: #f2eee9;
    border: 2px solid #d68c46;
  }
  .carddetails-timer.orange {
    background: #fff7ed;
    border: 2px solid #f97316;
  }
  .carddetails-timer.red {
    background: #fef2f2;
    border: 2px solid #ef4444;
  }
  .carddetails-timer-value {
    font-family: 'DM Mono', monospace;
    font-size: 26px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    line-height: 1;
    margin-bottom: 4px;
  }
  .carddetails-timer.green .carddetails-timer-value { color: #121212; }
  .carddetails-timer.orange .carddetails-timer-value { color: #ea580c; }
  .carddetails-timer.red .carddetails-timer-value { color: #dc2626; }

  .carddetails-timer-sub {
    font-size: 12.5px;
    color: #64748b;
    font-weight: 500;
  }

  /* Summary */
  .carddetails-summary {
    background: #f8fafc;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 22px;
    border: 1px solid #e8edf3;
  }
  .carddetails-summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .carddetails-summary-row + .carddetails-summary-row {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e8edf3;
  }
  .carddetails-summary-label {
    font-size: 13.5px;
    color: #64748b;
    font-weight: 500;
  }
  .carddetails-summary-value {
    font-size: 14px;
    font-weight: 700;
    color: #1a1a2e;
  }
  .carddetails-summary-value.amount {
    font-size: 18px;
    color: #d49f2d;
  }

  /* Travelers summary */
  .carddetails-travelers {
    background: #f8fafc;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 22px;
    border: 1px solid #e8edf3;
  }
  .carddetails-travelers-title {
    font-size: 13px;
    font-weight: 700;
    color: #374151;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .carddetails-traveler-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #e8edf3;
  }
  .carddetails-traveler-item:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  .carddetails-traveler-item:first-of-type {
    padding-top: 0;
  }
  .carddetails-traveler-name {
    font-size: 14px;
    font-weight: 600;
    color: #1a1a2e;
  }
  .carddetails-traveler-meta {
    font-size: 12.5px;
    color: #64748b;
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .carddetails-traveler-seat {
    background: #eba554;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 6px;
  }

  /* Form */
  .carddetails-field {
    margin-bottom: 16px;
  }
  .carddetails-label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 6px;
    letter-spacing: 0.01em;
  }
  .carddetails-input {
    width: 100%;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1.5px solid #ebc57e;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    color: #423526;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .carddetails-input::placeholder {
    color: #b0bac4;
  }
  .carddetails-input:focus {
    border-color: #e2872d;
  }
  .carddetails-input:disabled {
    background: #f8fafc;
    color: #a0aec0;
    cursor: not-allowed;
  }

  .carddetails-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  /* Pay button */
  .carddetails-pay-btn {
    width: 100%;
    padding: 15px;
    border-radius: 12px;
    border: none;
    background: #e1b077;
    color: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    margin-top: 6px;
    box-shadow: 0 4px 14px rgba(34,197,94,0.25);
  }
  .carddetails-pay-btn:hover:not(:disabled) {
    opacity: 0.93;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(34,197,94,0.30);
  }
  .carddetails-pay-btn:active:not(:disabled) {
    transform: translateY(0);
  }
  .carddetails-pay-btn:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    box-shadow: none;
  }

  .carddetails-expired-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #374151;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
  }
  .carddetails-expired-btn:hover {
    background: #f8fafc;
  }

  .carddetails-message {
    margin-top: 16px;
    text-align: center;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 16px;
    border-radius: 10px;
  }
  .carddetails-message.success {
    background: #f0fdf4;
    color: #16a34a;
    border: 1px solid #bbf7d0;
  }
  .carddetails-message.error {
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }

  /* Divider above form */
  .carddetails-divider {
    height: 1px;
    background: #e8edf3;
    margin: 0 0 20px;
  }

  /* Secure badges */
  .carddetails-badges {
    display: flex;
    justify-content: center;
    gap: 18px;
    margin-top: 18px;
  }
  .carddetails-badge {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 11.5px;
    color: #94a3b8;
    font-weight: 500;
  }

  /* Gender conflict warning */
  .carddetails-conflict {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 16px;
    font-size: 13px;
    color: #c2410c;
    font-weight: 500;
  }
`

function Carddetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedSeatIds, selectedSeatNos, travelers, Price, finalPrice, busId } = location.state || {};

  const [cardNumber, setCardNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [genderConflicts, setGenderConflicts] = useState([]);

  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [expired, setExpired] = useState(false);

  const socketRef = useRef(null);
  // ✅ Unique key per payment session — prevents duplicate charges on retry
  const idempotencyKeyRef = useRef(
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `key-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );
  const token = localStorage.getItem("access");

  useEffect(() => {
    if (expired) {
      handleRestart();
    }
  }, [expired]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://jstest.authorize.net/v1/Accept.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!busId || busId === "undefined") return;
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/bus/${busId}/seats/`);
    socketRef.current = socket;
    socket.onopen = () => console.log("WebSocket Connected ");
    socket.onerror = (e) => console.error("WebSocket Error :", e);
    socket.onclose = () => console.log("WebSocket Closed ");
    return () => { if (socket.readyState === WebSocket.OPEN) socket.close(); };
  }, [busId]);

  useEffect(() => {
    if (expired) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(interval); setExpired(true); return 0; }
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

  const timerClass = expired ? "red" : timeLeft <= 30 ? "red" : timeLeft <= 60 ? "orange" : "green";

  // ✅ FIXED: Now sends both `seat` and `travelers` to match backend POST expectations
  const createBookingAndNotify = async () => {
    const res = await fetch("http://127.0.0.1:8000/list/Bookingview/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${token}`
      },
      body: JSON.stringify({
        seat: selectedSeatIds,        // list of seat IDs
        travelers: travelers || []     // list of { name, age, gender } — one per seat
      })
    });

    if (!res.ok) throw new Error("Booking API failed");
    const data = await res.json();

    // Show gender conflict warning if any seats were skipped
    if (data.gender_conflict && data.gender_conflict.length > 0) {
      setGenderConflicts(data.gender_conflict);
    }

    // Notify via WebSocket for successfully booked seats
    const bookings = data.bookings;
    bookings.forEach((handledata) => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          username: handledata.user,
          seat_id: handledata.seat.seat_no,
          action: handledata.seat.seat_book ? "active" : "inactive"
        }));
      }
    });

    // If all seats had conflicts or were already booked, treat as failure
    if (bookings.length === 0) {
      const conflictMsg = data.gender_conflict?.length
        ? `Seat(s) ${data.gender_conflict.join(", ")} could not be booked due to gender policy.`
        : "Seats are no longer available.";
      throw new Error(conflictMsg);
    }

    return bookings;
  };

  // ─── Replace only the handlePayment function in your Carddetails.jsx ───────────
  // Everything else (styles, JSX, timer, state) stays EXACTLY the same.

  const handlePayment = () => {
    if (expired) { setMessage("Session expired. Please go back and select seats again."); return; }
    setLoading(true);
    setMessage("");
    setGenderConflicts([]);
    if (!window.Accept) { setMessage("Payment library not loaded yet. Please try again."); setLoading(false); return; }

    const authData = { apiLoginID: "73PHr3Jzuea", clientKey: "3jrc454tJWSPPm8gzLG352wwKq342SegME342TCt6kQp9A476e37bqGL6sc9n6yH" };
    const cardData = { cardNumber, month: expMonth, year: expYear, cardCode: cvv };

    window.Accept.dispatchData({ authData, cardData }, async function (response) {
      if (response.messages.resultCode === "Ok") {
        const opaqueData = response.opaqueData;

        try {
          // ✅ Send payment + booking data together in one request
          const payRes = await fetch("http://127.0.0.1:8000/list/api/pay/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`,
              "Idempotency-Key": idempotencyKeyRef.current
            },
            body: JSON.stringify({
              opaquedata: opaqueData,
              amount: finalPrice,
              seat_ids: selectedSeatIds,   // ✅ list of seat PKs
              travelers: travelers || [],   // ✅ [{name, age, gender}, ...]
              bus_id: busId                 // ✅ bus PK
            })
          });

          const payData = await payRes.json();

          if (!payRes.ok) {
            throw new Error(payData.reason || payData.status || payData.error || "Payment failed");
          }

          // ✅ Notify via WebSocket for each booking that came back
          if (payData.bookings && payData.bookings.length > 0) {
            payData.bookings.forEach((booking) => {
              if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify({
                  username: booking.user,
                  seat_id: booking.seat?.seat_no,
                  action: booking.seat?.seat_book ? "active" : "inactive"
                }));
              }
            });
          }

          // ✅ Show gender conflict warning if any seats were skipped
          // (Backend can optionally return gender_conflict in the payment response)
          if (payData.gender_conflict && payData.gender_conflict.length > 0) {
            setGenderConflicts(payData.gender_conflict);
          }

          setMessage("Booking confirmed! Redirecting...");
          setLoading(false);
          setTimeout(() => navigate("/mybookings"), 3000);

        } catch (err) {
          setMessage("Error: " + err.message);
          setLoading(false);
        }

      } else {
        setMessage("Payment failed: " + response.messages.message[0].text);
        setLoading(false);
      }
    });
  };

  const handleRestart = () => {
    if (busId || id) {
      navigate(`/bus/${busId || id}/seats`);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="carddetails-root">

        {/* Back row */}
        <div className="carddetails-back-row">
          <button className="carddetails-back-btn" onClick={() => navigate(-1)}>
            <ArrowBackIcon style={{ fontSize: 20 }} />
          </button>
          <h4 className="carddetails-title">Complete Payment</h4>
        </div>

        {/* Card */}
        <div className="carddetails-card">

          {/* Header */}
          <div className="carddetails-header">
            <span className="carddetails-header-icon"><i className="fa-solid fa-credit-card"></i></span>
            <span className="carddetails-header-text">Secure Payment</span>
          </div>

          {/* Timer */}
          <div className={`carddetails-timer ${timerClass}`}>
            {expired ? (
              <div className="carddetails-timer-value" style={{ color: "#e74c3c", fontWeight: "bold" }}>
                Session Expired. Redirecting...
              </div>
            ) : (
              <>
                <div className="carddetails-timer-value">
                  <span>⏱</span>
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <div className="carddetails-timer-sub">Complete payment before time runs out</div>
              </>
            )}
          </div>

          {/* Fare Summary */}
          <div className="carddetails-summary">
            <div className="carddetails-summary-row">
              <span className="carddetails-summary-label">Seats Selected:</span>
              <span className="carddetails-summary-value">{selectedSeatNos?.join(", ") || "—"}</span>
            </div>
            <div className="carddetails-summary-row">
              <span className="carddetails-summary-label">Amount to Pay</span>
              <span className="carddetails-summary-value amount">₹{finalPrice}</span>
            </div>
          </div>

          {/* ✅ Travelers Summary — shows each traveler with their seat */}
          {travelers && travelers.length > 0 && (
            <div className="carddetails-travelers">
              <div className="carddetails-travelers-title">👥 Traveler Details</div>
              {travelers.map((t, i) => (
                <div className="carddetails-traveler-item" key={i}>
                  <div>
                    <div className="carddetails-traveler-name">{t.name || "—"}</div>
                    <div className="carddetails-traveler-meta">
                      <span>Age: {t.age || "—"}</span>
                      <span>•</span>
                      <span style={{ textTransform: "capitalize" }}>{t.gender || "—"}</span>
                    </div>
                  </div>
                  <span className="carddetails-traveler-seat">
                    Seat {selectedSeatNos?.[i] || i + 1}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Gender conflict warning */}
          {genderConflicts.length > 0 && (
            <div className="carddetails-conflict">
              ⚠️ Seat(s) {genderConflicts.join(", ")} could not be booked — a neighboring seat is occupied by a male traveler (gender policy).
            </div>
          )}

          <div className="carddetails-divider" />

          {/* Card Number */}
          <div className="carddetails-field">
            <label className="carddetails-label">Card Number</label>
            <input
              className="carddetails-input"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              disabled={expired}
            />
          </div>

          {/* Month + Year */}
          <div className="carddetails-row">
            <div className="carddetails-field">
              <label className="carddetails-label">Month</label>
              <input
                className="carddetails-input"
                value={expMonth}
                onChange={(e) => setExpMonth(e.target.value)}
                placeholder="MM"
                maxLength={2}
                disabled={expired}
              />
            </div>
            <div className="carddetails-field">
              <label className="carddetails-label">Year</label>
              <input
                className="carddetails-input"
                value={expYear}
                onChange={(e) => setExpYear(e.target.value)}
                placeholder="YYYY"
                maxLength={4}
                disabled={expired}
              />
            </div>
          </div>

          {/* CVV */}
          <div className="carddetails-field">
            <label className="carddetails-label">CVV</label>
            <input
              type="password"
              className="carddetails-input"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="123"
              maxLength={4}
              disabled={expired}
            />
          </div>

          {/* Pay Button */}
          <button
            className="carddetails-pay-btn"
            onClick={handlePayment}
            disabled={loading || expired}
          >
            {loading ? "Processing..." : `Pay ₹${finalPrice}`}
          </button>

          {/* Expired fallback */}
          {expired && (
            <button className="carddetails-expired-btn" onClick={() => navigate(-2)}>
              ← Go Back & Reselect Seats
            </button>
          )}

          {/* Message */}
          {message && (
            <div className={`carddetails-message ${message.includes("confirmed") ? "success" : "error"}`}>
              {message}
            </div>
          )}

          {/* Trust badges */}
          {!expired && (
            <div className="carddetails-badges">
              <span className="carddetails-badge">🔒 SSL Secured</span>
              <span className="carddetails-badge">🛡️ PCI Compliant</span>
              <span className="carddetails-badge">✅ 256-bit Encrypted</span>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default Carddetails;