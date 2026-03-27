import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import '../css/Paymentprocess.css';

function Paymentprocess() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    // Data coming from Seats.jsx
    const { selectedSeatIds, selectedSeatNos, Price, busId } = location.state || {};

    const token = localStorage.getItem("access");

    const [coupons, setCoupons] = useState([]);
    const [travelers, setTravelers] = useState([]);
    const [businfo, setbusinfo] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [couponInput, setCouponInput] = useState("");

    // Particular bus details
    useEffect(() => {
        const fetchbus = async () => {
            try {
                const response = await axios.get(`buses/${id}`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                setbusinfo(response.data);
            } catch (error) {
                console.error("Error fetching bus:", error);
            }
        };
        fetchbus();
    }, [id, token]);

    // Coupons
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const response = await axios.get(`coupons/`, {
                    headers: { Authorization: `Token ${token}` },
                });
                setCoupons(response.data);
            } catch (error) {
                console.error("Error fetching coupons:", error);
            }
        };
        fetchCoupons();
    }, [token]);

    // Initialize traveler forms based on number of seats selected
    useEffect(() => {
        if (selectedSeatIds && selectedSeatIds.length > 0) {
            setTravelers(selectedSeatIds.map(() => ({ name: "", age: "", gender: "" })));
        }
    }, [selectedSeatIds]);

    const handleInputChange = (index, field, value) => {
        const updated = [...travelers];
        updated[index][field] = value;
        setTravelers(updated);
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        alert("Coupon copied: " + code);
    };

    const appliedCoupon = coupons.find((c) => c.Couponcode === couponInput);
    const finalPrice = Price - Number(appliedCoupon?.amount || 0) + 10;

    const handleProceedToPayment = () => {
        navigate(`/bus/${id}/journeydetails//payment/`, {
            state: {
                selectedSeatIds,
                selectedSeatNos,
                travelers,
                Price,
                finalPrice,
                busId,
            }
        });
    };

    return (
        <div className="min-vh-200 booking-page">
            <Navbar />
            <div className="container py-5">
                <div className="row g-4">
                    {/* Left Column */}
                    <div className="col-lg-8">
                        {/* Bus Ticket Card */}
                        {businfo && (
                            <div className="card border-0 shadow-lg mb-4 overflow-hidden rounded-4">
                                <div
                                    className="card-header border-0 py-3 text-white"
                                    style={{ background: 'linear-gradient(90deg, #7584a0 0%, #4a5f83 100%)' }}
                                >
                                    <div className="d-flex justify-content-between align-items-center px-2">
                                        <h6 className="mb-0 fw-bold text-uppercase">
                                            <i className="bi bi-geo-alt-fill me-2"></i>Journey Summary
                                        </h6>
                                        <span className="badge bg-white text-primary rounded-pill px-3 shadow-sm">Verified Route</span>
                                    </div>
                                </div>

                                <div className="card-body p-0">
                                    <div className="p-4 bg-white">
                                        <div className="row align-items-center">
                                            <div className="col-md-4 mb-3 mb-md-0 border-end-md">
                                                <small className="text-muted text-uppercase fw-bold">Operator</small>
                                                <h3 className="fw-black text-dark mb-1">{businfo.bus_name}</h3>
                                                <span className="text-primary small fw-semibold">
                                                    <i className="bi bi-stars me-1"></i> {businfo.features}
                                                </span>
                                            </div>

                                            <div className="col-md-8">
                                                <div className="d-flex justify-content-between align-items-center px-lg-3">
                                                    <div className="text-center">
                                                        <div className="h2 fw-black text-primary mb-0">{businfo.start_time}</div>
                                                        <div className="fw-bold text-dark">{businfo.starting_point}</div>
                                                        <div className="text-muted small text-uppercase">Departure</div>
                                                    </div>
                                                    <div className="flex-grow-1 mx-3 position-relative d-none d-sm-block">
                                                        <div className="border-bottom border-2 border-dashed border-secondary w-100 opacity-25"></div>
                                                        <div className="position-absolute top-50 start-50 translate-middle bg-white px-2">
                                                            <div className="bg-light p-2 rounded-circle shadow-sm border">
                                                                <i className="bi bi-bus-front-fill text-primary"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="h2 fw-black text-primary mb-0">{businfo.reach_time}</div>
                                                        <div className="fw-bold text-dark">{businfo.ending_points}</div>
                                                        <div className="text-muted small text-uppercase">Arrival</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-light border-top border-2 border-dashed p-3 px-4">
                                        <div className="row g-2">
                                            <div className="col-sm-4 d-flex align-items-center">
                                                <div className="bg-white p-2 rounded-3 me-2 shadow-sm">
                                                    <i className="bi bi-pin-map text-danger"></i>
                                                </div>
                                                <div>
                                                    <div className="text-muted small fw-bold text-uppercase">Origin</div>
                                                    <div className="small fw-bold">{businfo.starting_point}</div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 d-flex align-items-center">
                                                <div className="bg-white p-2 rounded-3 me-2 shadow-sm">
                                                    <i className="bi bi-flag-fill text-success"></i>
                                                </div>
                                                <div>
                                                    <div className="text-muted small fw-bold text-uppercase">Destination</div>
                                                    <div className="small fw-bold">{businfo.ending_points}</div>
                                                </div>
                                            </div>
                                            <div className="col-sm-4 d-flex align-items-center">
                                                <div className="bg-white p-2 rounded-3 me-2 shadow-sm">
                                                    <i className="bi bi-shield-check text-primary"></i>
                                                </div>
                                                <div>
                                                    <div className="text-muted small fw-bold text-uppercase">Service</div>
                                                    <div className="small fw-bold">{businfo.features}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Traveler Form */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white py-3">
                                <h5 className="mb-0 fw-bold">Traveler Information</h5>
                            </div>
                            <div className="card-body p-4">
                                {!submitted && travelers.map((traveler, index) => (
                                    <div key={index} className="p-4 mb-3 border rounded-3 bg-white">
                                        <h6 className="text-primary fw-bold mb-3">
                                            Passenger {index + 1}
                                            {selectedSeatNos && <span className="text-muted fw-normal ms-2">(Seat: {selectedSeatNos[index]})</span>}
                                        </h6>
                                        <div className="row g-3">
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Full Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-lg border-2"
                                                    placeholder="Passenger name"
                                                    value={traveler.name}
                                                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Age</label>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-lg border-2"
                                                    placeholder="Age"
                                                    value={traveler.age}
                                                    onChange={(e) => handleInputChange(index, "age", e.target.value)}
                                                />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label small fw-bold">Gender</label>
                                                <select
                                                    className="form-select form-select-lg border-2"
                                                    value={traveler.gender}
                                                    onChange={(e) => handleInputChange(index, "gender", e.target.value)}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {!submitted && (
                                    <div className="col-md-3 mt-3">
                                        <button className="btn custom-btn-brown btn-lg w-100 fw-bold shadow-sm" onClick={() => setSubmitted(true)}>
                                            Submit
                                        </button>
                                    </div>
                                )}

                                {submitted && travelers.map((traveler, index) => (
                                    <div key={index} className="passenger-box p-3 mb-3 border border-2 rounded-4 shadow-sm bg-white mt-4">
                                        <div className="row align-items-center">
                                            <div className="col-md-5 d-flex align-items-center">
                                                <div className="bg-brown-light p-2 rounded-circle me-3">
                                                    <i className="bi bi-person-fill text-brown"></i>
                                                </div>
                                                <div>
                                                    <p className="text-muted small text-uppercase mb-0 fw-bold">Passenger Name</p>
                                                    <h6 className="fw-bold mb-0 text-dark">{traveler.name || "Not Provided"}</h6>
                                                </div>
                                            </div>
                                            <div className="col-md-3 border-start">
                                                <p className="text-muted small text-uppercase mb-0 fw-bold">Age</p>
                                                <h6 className="fw-bold mb-0">{traveler.age || "N/A"} Years</h6>
                                            </div>
                                            <div className="col-md-4 border-start d-flex align-items-center justify-content-between">
                                                <span className={`badge rounded-pill ${traveler.gender === 'Male' ? 'bg-primary' : 'bg-info'} px-3`}>
                                                    {traveler.gender || "N/A"}
                                                </span>
                                                <button className="btn btn-sm btn-outline-warning ms-2" onClick={() => setSubmitted(false)}>
                                                    <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <button
                                    className="btn btn-primary btn-lg w-100 py-3 mt-3 fw-bold shadow"
                                    onClick={handleProceedToPayment}
                                    disabled={!submitted}
                                >
                                    Proceed to Secure Payment
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Price & Coupons */}
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-sm mb-4">
                            <div className="card-header bg-dark text-white py-3">
                                <h5 className="mb-0">Fare Summary</h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Seats</span>
                                    <span className="fw-bold">{selectedSeatNos?.join(", ")}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Base Fare</span>
                                    <span className="fw-bold">₹{Price}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tax & Fees</span>
                                    <span className="fw-bold">₹10.00</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <label>Coupon:</label>
                                    <input
                                        type="text"
                                        style={{ width: "10em" }}
                                        className="form-control"
                                        value={couponInput}
                                        placeholder="Coupon code"
                                        onChange={(e) => setCouponInput(e.target.value)}
                                    />
                                </div>
                                {appliedCoupon && (
                                    <div className="d-flex justify-content-between mb-2 text-success">
                                        <span>Discount</span>
                                        <span className="fw-bold">- ₹{appliedCoupon.amount}</span>
                                    </div>
                                )}
                                <hr />
                                <div className="d-flex justify-content-between">
                                    <h5 className="fw-bold text-success">Total Amount</h5>
                                    <h5 className="fw-bold text-success">₹{finalPrice}</h5>
                                </div>
                            </div>
                        </div>

                        {/* Coupons */}
                        <div className="card border-0 shadow-sm">
                            <div className="card-header bg-warning text-dark py-3">
                                <h5 className="mb-0 fw-bold">Offers & Coupons</h5>
                            </div>
                            <div className="card-body p-4">
                                {coupons.length > 0 ? (
                                    coupons.map((coupon) => (
                                        <div key={coupon.id} className="p-3 mb-3 border border-dashed rounded-3 bg-light d-flex justify-content-between align-items-center">
                                            <div>
                                                <div className="fw-bold text-dark">{coupon.name}</div>
                                                <div className="text-success small">{coupon.Couponcode}</div>
                                            </div>
                                            <button
                                                className="btn btn-sm btn-outline-primary fw-bold"
                                                onClick={() => copyToClipboard(coupon.Couponcode)}
                                            >
                                                COPY
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center mb-0">No offers today.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Paymentprocess;