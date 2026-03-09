import React, { useState, useEffect } from "react";
import "../css/Buses.css";
import Navbar from "./Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import FiltersContent from "./FiltersContent";

function Buses() {
  const location = useLocation();
  const navigate = useNavigate();
  const { filteredBuses } = location.state || {};

  // Raw bus data from API
  const [allBuses, setAllBuses] = useState([]);
  // Filtered buses to display
  const [filteredBusesList, setFilteredBusesList] = useState([]);
  // Filters from FiltersContent
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    busTypes: [],
    startTime: ""
  });
  // Search text
  const [searchText, setSearchText] = useState("");
  const token = localStorage.getItem("access")
  // Fetch buses once
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        let data = [];
        if (filteredBuses && filteredBuses.length > 0) {
          data = filteredBuses;
        } else {
          const response = await fetch("http://127.0.0.1:8000/list/buses/",{
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Token ${token}`
                    }
                });
          data = await response.json();
        }
        setAllBuses(data);
        setFilteredBusesList(data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      }
    };

    fetchBuses();
  }, [filteredBuses]);

  // Apply filters and search
  useEffect(() => {
    let updatedList = [...allBuses];

    // Price filter
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

    // Bus type filter
    if (filters.busTypes.length > 0) {
      updatedList = updatedList.filter((bus) =>
        filters.busTypes.some((type) =>
          bus.features.toLowerCase().trim().includes(type.toLowerCase().trim())
        )
      );
    }

    // Start time filter
    if (filters.startTime) {
      updatedList = updatedList.filter(
        (bus) => bus.start_time >= filters.startTime
      );
    }

    // Search filter
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
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <>
      <Navbar />

      <div className="bus-page">
        <div className="container py-5">
          <h2 className="text-center text-white fw-bold mt-5 mb-4">
            {filteredBuses ? "Available Buses" : "All Buses"}
          </h2>

          <div className="row">

            {/* Desktop Filters */}
            <div className="col-lg-3 d-none d-lg-block">
              <div className="bg-white shadow-sm p-4 rounded filter-sticky">
                <FiltersContent onApplyFilters={handleFilters} />
              </div>
            </div>

            {/* Bus List */}
            <div className="col-lg-9">

              {/* Mobile Filters Button */}
              <div className="d-lg-none mb-3">
                <button
                  className="btn btn-dark w-100"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#mobileFilters"
                >
                  <i className="fa fa-filter me-2"></i> Filters
                </button>
              </div>

              {/* Search Input */}
              <form className="d-flex mb-4">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search bus name..."
                  value={searchText}
                  onChange={handleSearch}
                />
              </form>

              {/* Bus Cards */}
              {filteredBusesList.length > 0 ? (
                filteredBusesList.map((bus) => (
                  <div key={bus.id} className="card mb-4 shadow-sm">
                    <div className="card-body p-4">
                      <div className="row align-items-center gy-3">

                        {/* Left */}
                        <div className="col-md-3">
                          <h5 className="fw-bold mb-1">{bus.bus_name}</h5>
                          <p className="text-muted small mb-2">{bus.features}</p>
                        </div>

                        {/* Center */}
                        <div className="col-md-5">
                          <div className="row text-center align-items-center">
                            <div className="col-5 text-start">
                              <div>{bus.start_time}</div>
                              <small>From: {bus.starting_point}</small>
                            </div>
                            <div className="col-2">→</div>
                            <div className="col-5 text-end">
                              <div>{bus.reach_time}</div>
                              <small>To: {bus.ending_points}</small>
                            </div>
                          </div>
                        </div>

                        {/* Right */}
                        <div className="col-md-4 text-end border-start">
                          <div className="text-muted small">Starts from</div>
                          <div className="fs-4 fw-bold">₹{bus.price}</div>
                          <button
                            className="btn btn-primary mt-2"
                            onClick={() => handleseats(bus.id)}
                          >
                            VIEW SEATS
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-white text-center">No buses found.</p>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filters Offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileFilters"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filters</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body">
          <FiltersContent onApplyFilters={handleFilters} />
        </div>
      </div>
    </>
  );
}

export default Buses;