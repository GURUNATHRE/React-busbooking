import React, { useState, useEffect } from "react";
import "../css/Buses.css";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import FiltersContent from "./FiltersContent";

// Theme Palette
const THEME = {
  orange: "#FF9933",
  deepOrange: "#e67e22",
  black: "#1a1a1a",
  lightGrey: "#f8f9fa",
  white: "#ffffff",
  gold: "#b99662"
};

function Buses() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get filteredBuses from the home page search state
  const { filteredBuses } = location.state || {};

  const [allBuses, setAllBuses] = useState([]);
  const [filteredBusesList, setFilteredBusesList] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    busTypes: [],
    startTime: ""
  });
  const [searchText, setSearchText] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // LOGIC: Only initialize with data if it was passed from the search
  useEffect(() => {
    if (filteredBuses && filteredBuses.length > 0) {
      setAllBuses(filteredBuses);
      setFilteredBusesList(filteredBuses);
    } else {
      setAllBuses([]);
      setFilteredBusesList([]);
    }
  }, [filteredBuses]);

  // Handle Internal Filtering & Searching
  useEffect(() => {
    let updatedList = [...allBuses];

    if (filters.minPrice) {
      updatedList = updatedList.filter(
        (bus) => Number(bus.price) >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      updatedList = updatedList.filter(
        (bus) => Number(bus.price) <= Number(filters.maxPrice)
      );
    }

    if (filters.busTypes.length > 0) {
      updatedList = updatedList.filter((bus) =>
        filters.busTypes.some((type) =>
          bus.features?.toLowerCase().trim().includes(type.toLowerCase().trim())
        )
      );
    }

    if (filters.startTime) {
      updatedList = updatedList.filter(
        (bus) => bus.start_time >= filters.startTime
      );
    }

    if (searchText) {
      updatedList = updatedList.filter((bus) =>
        bus.bus_name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredBusesList(updatedList);
  }, [allBuses, filters, searchText]);

  // Inside Buses.jsx
  const handleseats = (id) => {
    navigate(`/bus/${id}/seats`, {
      state: {
        filteredBuses: allBuses, 
        prevSearch: searchText  
      }
    });
  };
  const handleFilters = (data) => {
    setFilters(data);
    setShowFilters(false);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <Navbar />
      <div className="bus-page allbus" style={{ backgroundColor: '#f8efe8', minHeight: "100vh", paddingTop: "30px" }}>
        <div className="container py-4">

          {/* Header Section */}
          <div className="d-flex align-items-center mb-5">
            <button
              onClick={() => navigate("/")}
              className="btn shadow-sm d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#e67e22',
                color: THEME.white,
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                border: "none",
                marginRight: "20px",
                transition: "0.3s"
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = THEME.orange}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = THEME.deepOrange}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <h2 className="fw-bold m-0" style={{ color: THEME.black, letterSpacing: "-0.5px", fontSize: "2rem" }}>
              {filteredBuses ? "Available Journeys" : "Explore All Routes"}
            </h2>
          </div>

          {/* Search + Filter UI */}
          <div className="d-flex mb-5 gap-3" style={{ maxWidth: "900px" }}>
            <div className="position-relative flex-grow-1">
              <i className="fa fa-search position-absolute" style={{ left: "20px", top: "18px", color: THEME.orange }}></i>
              <input
                className="form-control border-0 shadow-sm"
                type="search"
                placeholder="Search bus operators (e.g. PRL)..."
                value={searchText}
                onChange={handleSearch}
                style={{
                  height: "55px",
                  borderRadius: "15px",
                  paddingLeft: "50px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  width: '60vw'
                }}
              />
            </div>
            <button
              className="btn px-4 fw-bold shadow-sm d-flex align-items-center gap-2"
              onClick={() => setShowFilters((prev) => !prev)}
              style={{
                borderRadius: "15px",
                height: "55px",
                backgroundColor: THEME.black,
                color: THEME.white,
                border: "none"
              }}
            >
              <i className="fa-solid fa-sliders" style={{ color: THEME.orange }}></i>
              Filters
            </button>
          </div>

          {/* Table Header Labels */}
          <div className="row px-4 mb-3 text-uppercase d-none d-md-flex" style={{ fontSize: "0.75rem", fontWeight: "800", color: "#444546", letterSpacing: "1px" }}>
            <div className="col-md-4">Bus Details</div>
            <div className="col-md-3 text-center">Departure & Route</div>
            <div className="col-md-2 text-center">Fare</div>
            <div className="col-md-3 text-end">Status</div>
          </div>

          {/* BUS LIST */}
          <div className="bus-list">
            {filteredBusesList.length > 0 ? (
              filteredBusesList.map((bus) => (
                <div key={bus.id} className="card border-0 mb-4 shadow-sm"
                  style={{
                    borderRadius: "20px",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                    borderLeft: `6px solid ${THEME.orange}`
                  }}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">

                      <div className="col-md-4">
                        <h5 className="fw-bold mb-2 text-dark text-uppercase" style={{ letterSpacing: "0.5px" }}>{bus.bus_name}</h5>
                        <div className="d-flex gap-2">
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: "800",
                            padding: "2px 12px",
                            borderRadius: "20px",
                            backgroundColor: "#fff3e0",
                            color: THEME.deepOrange,
                            border: `1px solid ${THEME.orange}`
                          }}>
                            {bus.features || "AC SLEEPER"}
                          </span>
                        </div>
                      </div>

                      <div className="col-md-3 text-center border-start border-end">
                        <h4 className="fw-bold mb-1" style={{ color: THEME.black }}>{bus.start_time}</h4>
                        <div className="small fw-bold text-dark mb-1">
                          {bus.starting_point} <i className="fa fa-arrow-right mx-1" style={{ color: THEME.orange }}></i> {bus.ending_points}
                        </div>
                        <div className="text-muted extra-small" style={{ fontSize: "0.75rem", fontWeight: "700" }}>Reach: {bus.reach_time}</div>
                      </div>

                      <div className="col-md-2 text-center">
                        <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#56585a" }}>Price</div>
                        <h4 className="fw-bold mb-0" style={{ color: THEME.black }}>₹{bus.price}</h4>
                      </div>

                      <div className="col-md-3 text-end">
                        <div className="mb-3">
                          <span className="text-success small fw-bold"><i className="fa fa-check-circle me-1"></i>Available</span>
                          <div className="text-muted extra-small" style={{ fontSize: "0.7rem" }}>Fast filling</div>
                        </div>
                        <button
                          className="btn fw-bold px-4 py-2"
                          onClick={() => handleseats(bus.id)}
                          style={{
                            backgroundColor: THEME.orange,
                            color: THEME.white,
                            borderRadius: "10px",
                            fontSize: "0.85rem",
                            transition: "0.3s"
                          }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = THEME.deepOrange}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = THEME.orange}
                        >
                          VIEW SEATS
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5" style={{ background: 'white', borderRadius: '20px', padding: '40px' }}>
                <i className="fa fa-bus fa-3x mb-3" style={{ color: THEME.black, opacity: 0.1 }}></i>
                <h4 style={{ color: "#64748b" }}>No buses found matching your journey.</h4>
                <p className="text-muted">Please go back to search for a new route.</p>
                <button
                  onClick={() => navigate("/")}
                  className="btn mt-3"
                  style={{ backgroundColor: THEME.black, color: 'white', borderRadius: '10px' }}
                >
                  Back to Search
                </button>
              </div>
            )}
          </div>

          {/* SLIDE-IN FILTER DRAWER */}
          <div style={{
            position: "fixed", top: 0, right: 0, height: "100vh", width: "380px",
            background: THEME.black,
            boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
            transform: showFilters ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 2000,
            padding: "30px"
          }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="text-white fw-bold m-0" style={{ letterSpacing: "1px" }}>Apply Filters</h5>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-sm rounded-circle text-white d-flex align-items-center justify-content-center"
                style={{ fontSize: "20px", border: "2px solid white", width: "30px", height: "30px" }}
              >×</button>
            </div>
            <div className="bg-white p-4 shadow-lg" style={{ borderRadius: "25px", maxHeight: "80vh", overflowY: "auto" }}>
              <FiltersContent onApplyFilters={handleFilters} />
            </div>
          </div>

          {/* DARK OVERLAY */}
          {showFilters && (
            <div
              onClick={() => setShowFilters(false)}
              style={{
                position: "fixed", inset: 0,
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(5px)",
                zIndex: 1500
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Buses;