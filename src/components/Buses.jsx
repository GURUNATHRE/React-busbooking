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

  const token = localStorage.getItem("access");

  // Fetch buses
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

  // Apply filters and search
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

          {/* Search + Filter Row */}
          <div className="d-flex mb-4 gap-2">
            <input
              className="form-control flex-grow-1"
              type="search"
              placeholder="Search bus name..."
              value={searchText}
              onChange={handleSearch}
              style={{ flex: 100 }}
            />
            <button
              className="btn btn-dark"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#filterSidebar"
              style={{ flex: 2 }}
            >
              <i className="fa fa-filter me-2"></i> Filters
            </button>
          </div>

          {/* Bus Cards */}
          {filteredBusesList.length > 0 ? (
            filteredBusesList.map((bus) => (
              <div key={bus.id} className="card mb-4 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="fw-bold mb-1">{bus.bus_name}</h5>
                      <p className="text-muted small mb-2">{bus.features}</p>
                      <div>
                        <small>
                          {bus.starting_point} → {bus.ending_points}
                        </small>
                      </div>
                      <div>
                        <small>
                          {bus.start_time} - {bus.reach_time}
                        </small>
                      </div>
                    </div>
                    <div className="text-end">
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

      {/* Filter Sidebar (Right Offcanvas) */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="filterSidebar"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title">Filters</h5>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div className="offcanvas-body">
          <FiltersContent onApplyFilters={handleFilters} />
        </div>
      </div>
    </>
  );
}

export default Buses;