import React, { useState, useEffect } from "react";
import "../css/Buses.css";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import FiltersContent from "./FiltersContent";
import axios from "axios";

function Buses() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        let data = [];
        if (filteredBuses && filteredBuses.length > 0) {
          data = filteredBuses;
        } else {
          const response = await axios.get(`buses/`, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Token ${token}`
            }
          });
          data = response.data;
        }
        setAllBuses(data);
        setFilteredBusesList(data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };
    fetchBuses();
  }, [filteredBuses, token]);

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
          bus.features.toLowerCase().trim().includes(type.toLowerCase().trim())
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

  const handleseats = (id) => {
    navigate(`/bus/${id}/seats`);
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
      <div className="bus-page allbus">
        <div className="container py-5">
          
          {/* Header Section with Back Button */}
          <div className="d-flex align-items-center mb-5 mt-5">
            <button 
              onClick={() => navigate("/")}
              className="btn d-flex align-items-center justify-content-center shadow-sm"
              style={{ 
                backgroundColor: "#000", 
                color: "#fff", 
                width: "45px", 
                height: "45px", 
                borderRadius: "50%",
                border: "none",
                marginRight: "20px"
              }}
            >
              <i className="fa fa-arrow-left"></i>
            </button>
            <h2 className="text-white fw-bold m-0" style={{ letterSpacing: "1px" }}>
              {filteredBuses ? "Available Buses" : "Explore All Buses"}
            </h2>
          </div>

          {/* Search + Filter UI */}
          <div className="search-box-container d-flex mb-4 gap-2">
            <div className="flex-grow-1">
              <input
                className="form-control shadow-sm border-0"
                type="search"
                placeholder="Search bus name..."
                value={searchText}
                onChange={handleSearch}
                style={{ height: "50px", borderRadius: "12px", paddingLeft: "20px" }}
              />
            </div>
            <button
              className="btn btn-dark px-4 fw-bold shadow-sm d-flex align-items-center"
              onClick={() => setShowFilters((prev) => !prev)}
              style={{ borderRadius: "12px", height: "50px", whiteSpace: "nowrap" }}
            >
              <i className="fa fa-filter me-2 text-info"></i> Filters
            </button>
          </div>

          {/* Table Header Labels */}
          <div className="row px-4 mb-3 text-white-50 small fw-bold text-uppercase d-none d-md-flex">
            <div className="col-md-4">Bus Details</div>
            <div className="col-md-3 text-center">Departure & Route</div>
            <div className="col-md-2 text-center">Fare</div>
            <div className="col-md-3 text-end">Availability</div>
          </div>

          {/* BUS LIST */}
          <div className="bus-list">
            {filteredBusesList.length > 0 ? (
              filteredBusesList.map((bus) => (
                <div key={bus.id} className="card border-0 shadow-sm mb-3 bus-hover-effect" style={{ borderRadius: "15px" }}>
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      
                      {/* 1. Bus Operator Name & Features */}
                      <div className="col-md-4">
                        <h5 className="fw-bold mb-1 text-dark text-uppercase">{bus.bus_name}</h5>
                        <p className="text-muted small mb-0">
                          <span className="badge bg-light text-primary border me-2">{bus.features || "Standard"}</span>
                        </p>
                      </div>

                      {/* 2. Time and Route */}
                      <div className="col-md-3 text-center border-start border-end">
                        <h4 className="fw-bold mb-0 text-dark">{bus.start_time}</h4>
                        <div className="text-muted extra-small fw-bold">
                          {bus.starting_point} <i className="fa fa-long-arrow-right mx-1 text-primary"></i> {bus.ending_points}
                        </div>
                        <div className="text-muted small">Reach: {bus.reach_time}</div>
                      </div>

                      {/* 3. Price */}
                      <div className="col-md-2 text-center">
                        <div className="text-muted extra-small" style={{ fontSize: "0.7rem" }}>FROM</div>
                        <h4 className="fw-bold text-dark mb-0">₹{bus.price}</h4>
                      </div>

                      {/* 4. Action & Seats */}
                      <div className="col-md-3 text-end">
                        <div className="mb-2">
                          <span className="text-success small fw-bold"><i className="fa fa-check-circle me-1"></i>Available</span>
                          <div className="text-muted extra-small">Fast filling</div>
                        </div>
                        <button
                          className="btn fw-bold px-4 w-100"
                          onClick={() => handleseats(bus.id)}
                          style={{ backgroundColor: "#ff7043", color: "#fff", borderRadius: "10px" }}
                        >
                          VIEW SEATS
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5 text-white">
                <i className="fa fa-bus fa-3x mb-3 opacity-50"></i>
                <h4>No buses found for this selection.</h4>
              </div>
            )}
          </div>

          {/* SLIDE-IN FILTER DRAWER */}
          <div style={{
            position: "fixed", top: 0, right: 0, height: "100vh", width: "350px",
            background: "linear-gradient(135deg, #1a1a1a 0%, #333 100%)",
            boxShadow: "-10px 0 30px rgba(0,0,0,0.5)",
            transform: showFilters ? "translateX(0)" : "translateX(100%)",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)", zIndex: 2000,
            overflowY: "auto"
          }}>
            <div className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="text-white fw-bold m-0">REFINE SEARCH</h5>
                <button 
                  onClick={() => setShowFilters(false)} 
                  className="btn btn-outline-light btn-sm rounded-circle"
                  style={{fontSize: "20px", width: "35px", height: "35px", lineHeight: "1"}}
                >×</button>
              </div>
              <div className="bg-white p-4" style={{ borderRadius: "20px" }}>
                <FiltersContent onApplyFilters={handleFilters} />
              </div>
            </div>
          </div>

          {/* DARK OVERLAY */}
          {showFilters && (
            <div 
              onClick={() => setShowFilters(false)} 
              style={{ 
                position: "fixed", inset: 0, 
                background: "rgba(0,0,0,0.6)", 
                backdropFilter: "blur(4px)", 
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