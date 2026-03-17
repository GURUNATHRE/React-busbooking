import React from "react";
import "../css/Businput.css";
import Navbar from "./Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Businput() {
    const navigate = useNavigate();

    // State
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(false);
    //  for cites 
    const [cities, setCities] = useState([]);
    const [showFrom, setShowFrom] = useState(false);
    const [showTo, setShowTo] = useState(false);

    const token = localStorage.getItem("access")
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    function handleSearch() {
        setSearchTrigger(true)
    }

    useEffect(() => {
        fetch("https://countriesnow.space/api/v0.1/countries")
            .then(res => res.json())
            .then(data => {
                const fetched_data = data.data
                const india = fetched_data.find((country) => country.country === "India");
                if (india) {
                    // for params from and to 
                    setCities(india.cities);
                }
            });
    }, []);

    const fetchBuses = async () => {
        try {
            const response = await fetch(`${BASE_URL}buses/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to fetch buses");
            }

            const buses = await response.json();

            const filteredBuses = buses.filter(
                (bus) =>
                    bus.starting_point.toLowerCase() === from.toLowerCase() &&
                    bus.ending_points.toLowerCase() === to.toLowerCase()
            );

            if (filteredBuses.length > 0) {
                navigate("/buses", { state: { filteredBuses } });
            } else {
                alert("No buses found for selected route");
            }

        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Something went wrong. Try again.");
        }
    };

    useEffect(() => {
        if (searchTrigger) {
            fetchBuses();
            setSearchTrigger(false); // reset
        }
    }, [searchTrigger]);

    return (
        <div id="total" className="d-flex flex-column min-vh-100">
            {/* NAVBAR  component*/}
            <Navbar />

            <section className="hero-section text-center my-5 d-flex align-items-center justify-content-center">
                <div className="container">
                    <h1 className="display-4 fw-bold">
                        India's No. 1 Bus Ticket Site
                    </h1>
                    <p >Safe, Secure and Comfortable Journeys</p>
                </div>
            </section>

            {/* SEARCH */}
            <section className="container search-wrapper  align-items-center justify-content-center">
                <div className="card search-card py-5 px-5">
                    <div className="row g-3">
                        <div className="col-md-4" style={{ position: "relative" }}>
                            <label className="form-label small fw-bold text-muted">
                                FROM
                            </label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="From city"
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                onFocus={() => setShowFrom(true)}
                                onBlur={() => {
                                    setTimeout(() => setShowFrom(false));
                                }}
                            />

                            {showFrom && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "white",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        maxHeight: "150px",
                                        overflowY: "auto",
                                        zIndex: 9999
                                    }}
                                >
                                    {cities
                                        .filter((city) =>
                                            city.toLowerCase().includes(from.toLowerCase())
                                        )
                                        .slice(0, 4)
                                        .map((city, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: "8px",
                                                    cursor: "pointer"
                                                }}
                                                onMouseDown={() => {
                                                    setFrom(city);
                                                    setShowFrom(false);
                                                }}
                                            >
                                                {city}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        <div className="col-md-4" style={{ position: "relative" }}>
                            <label className="form-label small fw-bold text-muted">
                                TO
                            </label>

                            <input
                                type="text"
                                className="form-control form-control-lg"
                                placeholder="To city"
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                onFocus={() => setShowTo(true)}
                                onBlur={() => {
                                    setTimeout(() => setShowTo(false));
                                }}
                            />

                            {showTo && (
                                <div
                                    style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: 0,
                                        right: 0,
                                        backgroundColor: "white",
                                        border: "1px solid #ccc",
                                        borderRadius: "5px",
                                        maxHeight: "150px",
                                    }}
                                >
                                    {cities
                                        .filter((city) =>
                                            city.toLowerCase().includes(to.toLowerCase())
                                        )
                                        .slice(0, 4)
                                        .map((city, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    padding: "8px",
                                                    cursor: "pointer"
                                                }}
                                                onMouseDown={() => {
                                                    setTo(city);
                                                    setShowTo(false);
                                                }}
                                            >
                                                {city}
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold text-muted">
                                <i className="fa-regular fa-calendar-days me-2"></i>DATE
                            </label>
                            <input
                                type="date"
                                className="form-control form-control-lg"
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        {/* need yo handle  */}
                        <div className="col-md-1 d-flex align-items-end">
                            <button onClick={handleSearch} className="btn w-100 h-75" style={{ backgroundColor: "#a36532" }}><i className="fa-solid fa-magnifying-glass"></i></button>
                        </div>
                    </div>
                    <datalist id="cityList">
                        {cities.map((city, index) => (
                            <option key={index} value={city} />
                        ))}
                    </datalist>
                </div>
            </section>


            {/* ofers  */}
            <section className="container my-5 " >
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="fw-bold" style={{ color: "white" }}>Exclusive Offers</h3>
                    <a href="" className="text-danger fw-bold text-decoration-none">View All</a>
                </div>
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="card offer-card shadow-sm bg-primary text-white p-4">
                            <h5>SAVE UP TO ₹250</h5>
                            <p className="small">Use code: FIRSTBUS</p>
                            <span className="badge bg-white text-primary align-self-start">First Time Users</span>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card offer-card shadow-sm bg-success text-white p-4">
                            <h5>CASHBACK ₹150</h5>
                            <p className="small">On visa card</p>
                            <span className="badge bg-white text-success align-self-start">Wallet Offer</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card offer-card shadow-sm bg-warning text-dark p-4">
                            <h5>GROUP BOOKING</h5>
                            <p className="small">Flat 10% Off for 4+ Seats</p>
                            <span className="badge bg-dark text-white align-self-start">Limited Period</span>
                        </div>
                    </div>
                </div>
            </section>
            {/* FOOTER */}
            <footer className="mt-5 pt-1">
                <div className="container-fluid bg-dark ">
                    <div className="row">
                        <div className="col-md-4 ">
                            <h5 className="fw-bold mb-3"><i className="fa-solid fa-bus-simple me-2"></i>BusTicket</h5>
                            <p className="small text-secondary m-3">Book your bus tickets online easily with our fast, secure, and reliable service. Your next travel adventure across India starts here.</p>
                        </div>
                        <div className="col-md-4  text-center">
                            <h5 className="fw-bold mb-3">Quick Links</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-secondary text-decoration-none small">About Us</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">Terms & Conditions</a></li>
                                <li><a href="#" className="text-secondary text-decoration-none small">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-md-4 ">
                            <h5 className="fw-bold mb-3">Support</h5>
                            <p className="small text-secondary mb-1">Email: support@busticket.com</p>
                            <p className="small text-secondary mb-3">Contact: +91 99999 99999</p>
                            <div className="fs-4">
                                <a href="https://www.facebook.com/login/"><i className="fa-brands fa-facebook-f me-3 text-secondary"></i></a>
                                <a href=""><i className="fa-brands fa-twitter me-3 text-secondary"></i></a>
                                <a href=""><i className="fa-brands fa-instagram text-secondary"></i></a>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-secondary small mb-0" style={{ color: "white" }}>© 2026 BusTicket India. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Businput;