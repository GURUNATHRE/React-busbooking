import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import html2pdf from "html2pdf.js";
const frontendUrl = window.location.origin;
/* ─── styles ─────────────────────────────────────────────────────────────── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  .mb-root { background: #f1e2d5; min-height: 100vh; font-family: 'DM Sans', sans-serif; padding-bottom: 60px; }

  /* ── page header */
  .mb-header { background: linear-gradient(135deg, #bb8849 0%, #e9ab5a 100%); padding: 48px 24px 36px; text-align: center; }
  .mb-header h1 { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 0 0 8px; letter-spacing: -0.5px; }
  .mb-header p  { color: #4d4949; font-size: 25px; margin: 0; }

  /* ── tabs */
  .mb-tabs { display: flex; justify-content: center; gap: 0; max-width: 520px; margin: -20px auto 32px; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
  .mb-tab  { flex: 1; padding: 14px 0; font-size: 14px; font-weight: 700; cursor: pointer; border: none; transition: background 0.2s, color 0.2s; }
  .mb-tab.active  { background: #eba554; color: #fff; }
  .mb-tab.inactive{ background: #fff; color: #64748b; }
  .mb-tab.inactive:hover { background: #f8fafc; }

  /* ── content wrapper */
  .mb-content { max-width: 860px; margin: 0 auto; padding: 0 16px; }

  /* ── spinner */
  .mb-spinner { display: flex; justify-content: center; align-items: center; padding: 80px 0; }
  .mb-spinner-ring { width: 42px; height: 42px; border: 4px solid #e8edf3; border-top-color: #eba554; border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── empty state */
  .mb-empty { text-align: center; background: #fff; border-radius: 20px; padding: 56px 32px; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
  .mb-empty-icon { font-size: 56px; margin-bottom: 16px; }
  .mb-empty h3 { font-size: 20px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }
  .mb-empty p  { color: #64748b; margin-bottom: 24px; }
  .mb-empty-btn { background: #eba554; color: #fff; border: none; border-radius: 50px; padding: 12px 28px; font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
  .mb-empty-btn:hover { opacity: 0.88; }

  /* ── booking card */
  .mb-ticket { background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px; display: flex; border: 1px solid #e8edf3; }
  .mb-ticket-left  { flex: 1; padding: 24px 28px; border-right: 2px dashed #e2e8f0; }
  .mb-ticket-right { width: 180px; background: #f8fafc; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; flex-shrink: 0; }
  @media (max-width: 600px) {
    .mb-ticket { flex-direction: column; }
    .mb-ticket-right { width: 100%; border-right: none; border-top: 2px dashed #e2e8f0; }
  }

  .mb-status-badge { display: inline-flex; align-items: center; gap: 6px; background: #e8f5e9; color: #16a34a; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 50px; margin-bottom: 12px; }

  .mb-bus-row { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .mb-bus-icon { background: #eba554; color: #fff; width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .mb-bus-name { font-size: 18px; font-weight: 800; color: #1a1a2e; margin: 0; }
  .mb-bus-ref  { font-size: 20px; color: #161616; margin: 0; border: 1px solid #e8edf3; display: inline-block;  border-radius: 8px; font-weight: 600; background: #f1e2d6; }

  .mb-info-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-bottom: 18px; }
  .mb-info-cell { }
  .mb-info-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px; }
  .mb-info-value { font-size: 15px; font-weight: 700; color: #1a1a2e; }
  .mb-info-cell:not(:last-child) { border-right: 1px solid #e8edf3; padding-right: 12px; }
  .mb-info-cell:not(:first-child){ padding-left: 12px; }

  .mb-travelers-title { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 10px; }
  .mb-traveler-chip { display: inline-flex; flex-direction: column; gap: 2px; background: #f1eeea; border: 1px solid #e8edf3; border-radius: 10px; padding: 8px 12px; margin: 4px 4px 4px 0; }
  .mb-traveler-chip-name { font-size: 15px; font-weight: 700; color: #1a1a2e; }
  .mb-traveler-chip-sub  { font-size: 13px; color: #64748b; }

  .mb-qr img { display: block; border-radius: 8px; }
  .mb-scan-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.07em; }
  .mb-download-btn { background: #1a1a2e; color: #fff; border: none; border-radius: 50px; padding: 8px 16px; font-size: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity 0.2s; }
  .mb-download-btn:hover { opacity: 0.82; }

  /* ── payment card */
  .mb-pay-card { background: #fff; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 16px; border: 1px solid #e8edf3; overflow: hidden; }
  .mb-pay-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid #e8edf3; }
  .mb-pay-amount { font-size: 22px; font-weight: 800; color: #1a1a2e; }
  .mb-pay-amount span { font-size: 14px; font-weight: 500; color: #64748b; margin-left: 4px; }
  .mb-pay-status-badge { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 50px; }
  .mb-pay-status-badge.captured          { background: #e8f5e9; color: #16a34a; }
  .mb-pay-status-badge.refunded          { background: #ede9fe; color: #7c3aed; }
  .mb-pay-status-badge.pending           { background: #fef9c3; color: #92400e; }
  .mb-pay-status-badge.failed,
  .mb-pay-status-badge.declined,
  .mb-pay-status-badge.error             { background: #fef2f2; color: #dc2626; }

  .mb-pay-body { padding: 16px 24px; }
  .mb-pay-meta { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 14px; }
  .mb-pay-meta-item label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; display: block; margin-bottom: 2px; }
  .mb-pay-meta-item span  { font-size: 13px; font-weight: 600; color: #374151; font-family: 'DM Mono', monospace; }

  /* refund section */
  .mb-refund-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .mb-refund-btn  { background: #fff; border: 2px solid #eba554; color: #eba554; border-radius: 50px; padding: 8px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .mb-refund-btn:hover:not(:disabled) { background: #eba554; color: #fff; }
  .mb-refund-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .mb-refund-confirm { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 12px; padding: 14px 18px; margin-top: 12px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .mb-refund-confirm p { margin: 0; font-size: 13px; font-weight: 600; color: #92400e; }
  .mb-refund-confirm-btns { display: flex; gap: 8px; }
  .mb-refund-yes { background: #dc2626; color: #fff; border: none; border-radius: 8px; padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; }
  .mb-refund-yes:hover { opacity: 0.85; }
  .mb-refund-no  { background: #f8fafc; color: #374151; border: 1.5px solid #e2e8f0; border-radius: 8px; padding: 8px 14px; font-size: 13px; font-weight: 600; cursor: pointer; }
  .mb-refund-no:hover { background: #e8edf3; }
  .mb-refund-msg { margin-top: 10px; font-size: 13px; font-weight: 600; padding: 10px 14px; border-radius: 8px; }
  .mb-refund-msg.ok  { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .mb-refund-msg.err { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .mb-refund-info { font-size: 12px; color: #94a3b8; margin-top: 8px; }
`;

/* ─── status badge colour helper ─────────────────────────────────────────── */
function payStatusClass(s) {
    if (!s) return "pending";
    s = s.toLowerCase();
    if (s === "captured") return "captured";
    if (s === "refunded" || s === "partially_refunded") return "refunded";
    if (s === "pending") return "pending";
    return "failed";
}

/* ─── component ──────────────────────────────────────────────────────────── */
function MyBookings() {
    const [tab, setTab] = useState("bookings");
    const [mybookings, setMybookings] = useState([]);
    const [payments, setPayments] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);
    const [paymentsLoading, setPaymentsLoading] = useState(true);

    // per-payment refund state:  { [paymentId]: {showing, loading, msg, ok} }
    const [refundState, setRefundState] = useState({});

    const token = localStorage.getItem("access");
    const navigate = useNavigate();

    /* ── fetch bookings ───────────────────────────────────────────────────── */
    const fetchBookings = useCallback(async () => {
        setBookingsLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/list/Bookingview/user/", {
                headers: { "Authorization": `Token ${token}` }
            });
            const data = await res.json();
            setMybookings(data);
            // console.log("Fetched bookings:", data);
        } catch (e) {
            console.error("Bookings fetch error:", e);
        } finally {
            setBookingsLoading(false);
        }
    }, [token]);

    /* ── fetch payments ───────────────────────────────────────────────────── */
    const fetchPayments = useCallback(async () => {
        setPaymentsLoading(true);
        try {
            const res = await fetch("http://127.0.0.1:8000/list/api/payments/", {
                headers: { "Authorization": `Token ${token}` }
            });
            const data = await res.json();
            setPayments(data);
            // console.log("Fetched payments:", data);
        } catch (e) {
            console.error("Payments fetch error:", e);
        } finally {
            setPaymentsLoading(false);
        }
    }, [token]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);
    useEffect(() => { fetchPayments(); }, [fetchPayments]);

    /* ── PDF download ─────────────────────────────────────────────────────── */
    const handleDownload = (id) => {
        const el = document.getElementById(`ticket-${id}`);
        html2pdf().set({
            margin: 0.3,
            filename: `ticket-${id}.pdf`,
            image: { type: "jpeg", quality: 1 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        }).from(el).save();
    };

    /* ── refund helpers ───────────────────────────────────────────────────── */
    const showRefundConfirm = (payId) => {
        setRefundState(prev => ({
            ...prev,
            [payId]: { showing: true, loading: false, msg: null, ok: null }
        }));
    };
    const cancelRefund = (payId) => {
        setRefundState(prev => ({ ...prev, [payId]: { showing: false } }));
    };

    const isRefundEligible = (pay) => {
        if (!pay?.transaction_id || pay.status !== "captured") return false;
        const created = new Date(pay.created_at);
        return (Date.now() - created.getTime()) <= 24 * 60 * 60 * 1000;
    };

    const doRefund = async (payment) => {
        const id = payment.id;
        setRefundState(prev => ({ ...prev, [id]: { showing: true, loading: true, msg: null } }));
        try {
            const res = await fetch("http://127.0.0.1:8000/list/api/refund/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                },
                body: JSON.stringify({
                    transaction_id: payment.transaction_id,
                    amount: payment.amount,
                    booking_ids: (payment.bookings || []).map(b => b.id)
                })
            });
            const data = await res.json();
            if (res.ok) {
                setRefundState(prev => ({
                    ...prev, [id]: {
                        showing: false, loading: false,
                        msg: `✅ Refund successful! Refund Txn: ${data.refund_transaction_id}`,
                        ok: true
                    }
                }));
                // update payment status in local state immediately
                setPayments(prev =>
                    prev.map(p => p.id === id ? { ...p, status: "refunded" } : p)
                );
            } else {
                setRefundState(prev => ({
                    ...prev, [id]: {
                        showing: false, loading: false,
                        msg: `❌ ${data.error || "Refund failed"}`,
                        ok: false
                    }
                }));
            }
        } catch {
            setRefundState(prev => ({
                ...prev, [id]: { showing: false, loading: false, msg: "❌ Network error", ok: false }
            }));
        }
    };

    /* ── render ──────────────────────────────────────────────────────────── */
    return (
        <>
            <style>{styles}</style>
            <div className="mb-root">
                <Navbar />

                {/* Page Header */}
                <div className="mb-header">
                    <h1>Your Journey Hub</h1>
                    <p>View bookings, download tickets, and manage payments in one place.</p>
                </div>

                {/* Tabs */}
                <div className="mb-tabs">
                    <button
                        id="tab-bookings"
                        className={`mb-tab ${tab === "bookings" ? "active" : "inactive"}`}
                        onClick={() => setTab("bookings")}
                    >
                        <i className="fa-solid fa-book" style={{ color: 'rgb(26, 26, 26)' }}></i> My Bookings
                    </button>
                    <button
                        id="tab-payments"
                        className={`mb-tab ${tab === "payments" ? "active" : "inactive"}`}
                        onClick={() => setTab("payments")}
                    >
                        <i className="fa-solid fa-credit-card" style={{ color: 'rgb(36, 36, 36)' }}></i> Payment History
                    </button>
                </div>

                <div className="mb-content">

                    {/* ── BOOKINGS TAB ───────────────────────────────────── */}
                    {tab === "bookings" && (
                        bookingsLoading ? (
                            <div className="mb-spinner"><div className="mb-spinner-ring" /></div>
                        ) : (!Array.isArray(mybookings) || mybookings.length === 0) ? (
                            <div className="mb-empty">
                                <div className="mb-empty-icon">🎟️</div>
                                <h3>No bookings yet</h3>
                                <p>You haven't reserved any seats. Find a bus and book your trip!</p>
                                <button className="mb-empty-btn" onClick={() => navigate("/")}>
                                    Browse Buses
                                </button>
                            </div>
                        ) : (
                            mybookings.map(booked => (
                                <div id={`ticket-${booked.id}`} key={booked.id} className="mb-ticket">

                                    {/* LEFT — ticket info */}
                                    <div className="mb-ticket-left">
                                        <div className="mb-status-badge">● Confirmed</div>
                                        <small style={{ color: "#94a3b8", fontSize: 12, display: "block", marginBottom: 12 }}>
                                            Booking ID: #{booked.id}
                                        </small>

                                        <div className="mb-bus-row">
                                            <div className="mb-bus-icon"><DirectionsBusIcon /></div>
                                            <div>
                                                <p className="mb-bus-name">{booked.bus?.bus_name}</p>

                                                <p className="mb-bus-ref">
                                                    Bus No: {booked.bus?.bus_number}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mb-info-grid">
                                            <div className="mb-info-cell">
                                                <div className="mb-info-label">Seat</div>
                                                <div className="mb-info-value" style={{ color: "#eba554" }}>
                                                    #{booked.seat?.seat_no}
                                                </div>
                                            </div>
                                            <div className="mb-info-cell">
                                                <div className="mb-info-label">Date</div>
                                                <div className="mb-info-value">
                                                    {new Date(booked.journey_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                                </div>
                                            </div>
                                            <div className="mb-info-cell">
                                                <div className="mb-info-label">Passenger</div>
                                                <div className="mb-info-value" style={{ fontSize: 13 }}>{booked.user}</div>
                                            </div>
                                        </div>

                                        {/* Travelers */}
                                        {booked.travelers?.length > 0 && (
                                            <div>
                                                <span className="mb-travelers-title">👥 Travelers</span>
                                                {booked.travelers.map((booked, i) => (
                                                    <div className="mb-traveler-chip" key={i} style={{ marginLeft: "20px" }}>
                                                        <span className="mb-traveler-chip-name">{booked.name}</span>
                                                        <span className="mb-traveler-chip-sub">Age {booked.age} · {booked.gender}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Coupon */}
                                        {booked.coupon && (
                                            <div style={{ marginTop: 12, background: "#fef9c3", borderRadius: 10, padding: "8px 12px", fontSize: 13, fontWeight: 600, color: "#92400e" }}>
                                                🎉 Coupon Applied: <strong>{booked.coupon}</strong>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT — QR + download */}
                                    <div className="mb-ticket-right">
                                        <div className="mb-scan-label">Scan for Entry</div>
                                        <div className="mb-qr">
                                            <img
                                                src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${frontendUrl}/Bookingview/user/${booked.id}`}
                                                alt="QR Code"
                                                width={110}
                                                height={110}
                                            />
                                        </div>
                                        <button className="mb-download-btn" onClick={() => handleDownload(booked.id)}>
                                            <DownloadForOfflineIcon fontSize="small" />
                                            Download
                                        </button>
                                    </div>

                                </div>
                            ))
                        )
                    )}

                    {/* ── PAYMENT HISTORY TAB ────────────────────────────── */}
                    {tab === "payments" && (
                        paymentsLoading ? (
                            <div className="mb-spinner"><div className="mb-spinner-ring" /></div>
                        ) : payments.length === 0 ? (
                            <div className="mb-empty">
                                <div className="mb-empty-icon">💳</div>
                                <h3>No payments found</h3>
                                <p>Your payment history will appear here after your first booking.</p>
                            </div>
                        ) : (
                            payments.map(pay => {
                                const rs = refundState[pay.id] || {};
                                return (
                                    <div key={pay.id} className="mb-pay-card" style={{
                                        background: '#fff',
                                        borderRadius: '16px',
                                        padding: '24px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                        marginBottom: '20px'
                                    }}>
                                        {/* 1. Header Section: Amount & Status */}
                                        <div className="mb-pay-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                            <div>
                                                <div className="mb-pay-amount" style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                                    ${pay.amount}
                                                    <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>{pay.currency}</span>
                                                </div>
                                                <div style={{ color: "#94a3b8", fontSize: '13px', marginTop: '4px', fontWeight: '500' }}>
                                                    {new Date(pay.created_at).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                </div>
                                            </div>

                                            <span className={`mb-pay-status-badge ${payStatusClass(pay.status)}`} style={{
                                                padding: '6px 12px',
                                                borderRadius: '8px',
                                                fontSize: '12px',
                                                fontWeight: '700',
                                                letterSpacing: '0.05em'
                                            }}>
                                                {pay.status?.replace("_", " ").toUpperCase()}
                                            </span>
                                        </div>

                                        {/* 2. Bookings Section: Tag Cloud Style */}
                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.8px' }}>
                                                Booking & Passenger Details
                                            </label>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                                {pay.bookings?.map((booking) => (
                                                    <div key={booking.id} style={{
                                                        background: '#f8fafc',
                                                        border: '1px solid #e2e8f0',
                                                        borderRadius: '12px',
                                                        padding: '12px 16px',
                                                        position: 'relative',
                                                        overflow: 'hidden'
                                                    }}>
                                                        {/* 1. Bus & Seat Header */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                                <span style={{ fontSize: '18px' }}><i className="fa-solid fa-bus" style={{ color: 'rgb(219, 166, 87)' }}></i></span>
                                                                <div>
                                                                    <span style={{ display: 'block', fontSize: '14px', fontWeight: '700', color: '#1e293b' }}>
                                                                        {booking.bus?.bus_name}
                                                                    </span>
                                                                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>
                                                                        Bus No: {booking.bus?.bus_number} • ID: #{booking.id} • Booked by: {booking.user}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Prominent Seat Badge */}
                                                            <div style={{ textAlign: 'right', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '4px 10px', boxShadow: '0 2px 4px rgba(0,0,0,0.03)' }}>
                                                                <span style={{ display: 'block', fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '800' }}>Seat</span>
                                                                <span style={{ fontSize: '16px', fontWeight: '800', color: '#4f79bd' }}>{booking.seat.seat_no}</span>
                                                            </div>
                                                        </div>

                                                        {/* 2. Travelers List */}
                                                        <div style={{
                                                            marginTop: '10px',
                                                            paddingTop: '10px',
                                                            borderTop: '1px dashed #e2e8f0',
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: '6px'
                                                        }}>
                                                            <span style={{ fontSize: '12px', color: '#64748b', marginRight: '4px', fontWeight: '600' }}>Passengers:</span>
                                                            {booking.travelers?.map((t, idx) => (
                                                                <div key={idx} style={{
                                                                    fontSize: '12px',
                                                                    background: '#fff',
                                                                    padding: '2px 8px',
                                                                    borderRadius: '6px',
                                                                    border: '1px solid #e2e8f0',
                                                                    color: '#475569',
                                                                    fontWeight: '500'
                                                                }}>
                                                                    {t.name} <span style={{ color: '#94a3b8', fontSize: '10px' }}>({t.gender[0]}, {t.age})</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 3. Meta Grid: Payment Details */}
                                        <div className="mb-pay-body" style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '20px',
                                            paddingTop: '20px',
                                            borderTop: '1px solid #f1f5f9'
                                        }}>
                                            <div className="mb-pay-meta-item">
                                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Transaction ID</label>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155', fontFamily: 'monospace' }}>{pay.transaction_id || "—"}</span>
                                            </div>

                                            <div className="mb-pay-meta-item">
                                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Payment Method</label>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>
                                                    {pay.card_type ? `${pay.card_type} •••• ${pay.card_last4}` : "—"}
                                                </span>
                                            </div>

                                            <div className="mb-pay-meta-item">
                                                <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Gateway</label>
                                                <span style={{ fontSize: '14px', fontWeight: '500', color: '#334155' }}>{pay.gateway || "authorize_net"}</span>
                                            </div>
                                        </div>

                                        {/* 4. Refund & Status Messaging */}
                                        {(pay.status === "refunded" || pay.status_reason) && (
                                            <div style={{ marginTop: '20px', padding: '12px', borderRadius: '12px', background: pay.status === 'refunded' ? '#f0fdf4' : '#fef2f2', border: `1px solid ${pay.status === 'refunded' ? '#bbf7d0' : '#fee2e2'}` }}>
                                                {pay.status === "refunded" && (
                                                    <div style={{ fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                                                        ↩ Refund processed: <strong>{pay.refund_transaction_id}</strong> · Amount: <strong>${pay.refunded_amount}</strong>
                                                    </div>
                                                )}
                                                {pay.status_reason && pay.status !== "captured" && pay.status !== "refunded" && (
                                                    <div style={{ fontSize: '13px', color: '#991b1b', fontWeight: '500' }}>
                                                        ⚠️ {pay.status_reason}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* 5. Refund Action Area */}
                                        {pay.status === "captured" && pay.transaction_id && (
                                            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px dashed #e2e8f0' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '12px', color: "#64748b", fontWeight: '500' }}>
                                                        {isRefundEligible(pay) ? "✓ Eligible for 24h refund" : "✕ Refund window closed"}
                                                    </span>
                                                    <button
                                                        className="mb-refund-btn"
                                                        onClick={() => showRefundConfirm(pay.id)}
                                                        disabled={rs.loading || !isRefundEligible(pay)}
                                                        style={{
                                                            padding: '8px 16px',
                                                            borderRadius: '10px',
                                                            fontSize: '13px',
                                                            fontWeight: '600',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            background: isRefundEligible(pay) ? '#f5e9df' : '#f1f5f9',
                                                            color: isRefundEligible(pay) ? '#d87e43' : '#94a3b8',
                                                            border: `1px solid ${isRefundEligible(pay) ? '#f07e14' : 'transparent'}`
                                                        }}
                                                    >
                                                        {rs.loading ? "Processing..." : "Request Refund"}
                                                    </button>
                                                </div>

                                                {rs.showing && !rs.loading && (
                                                    <div style={{ marginTop: '16px', padding: '16px', background: '#fff1f2', borderRadius: '12px', border: '1px solid #fecdd3' }}>
                                                        <p style={{ fontSize: '14px', color: '#9f1239', margin: '0 0 12px 0' }}>Confirm refund of <strong>${pay.amount}</strong>? This action is permanent.</p>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => doRefund(pay)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: '600' }}>Yes, Refund</button>
                                                            <button onClick={() => cancelRefund(pay.id)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#fff', border: '1px solid #fecdd3', fontWeight: '600' }}>Cancel</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )
                    )}

                </div>
            </div>
        </>
    );
}

export default MyBookings;