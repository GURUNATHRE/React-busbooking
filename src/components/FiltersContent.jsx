import React, { useState } from "react";

function FiltersContent({ onApplyFilters }) {
  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    busTypes: [],
  });

  // Handle price input change
  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Handle checkbox change
  const handleBusTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFilters({
        ...filters,
        busTypes: [...filters.busTypes, value],
      });
    } else {
      setFilters({
        ...filters,
        busTypes: filters.busTypes.filter((type) => type !== value),
      });
    }
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    onApplyFilters(filters); // send to parent
  };

  // Clear all filters
  const handleClear = () => {
    const cleared = {
      minPrice: "",
      maxPrice: "",
      busTypes: [],
    };
    setFilters(cleared);
    console.log("clearing the details ", cleared);
    onApplyFilters(cleared);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold m-0 text-dark">Filters</h5>
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-link btn-sm text-danger p-0 text-decoration-none fw-bold"
          style={{ fontSize: "0.8rem" }}
        >
          CLEAR ALL
        </button>
      </div>

      <hr style={{ opacity: "0.1" }} />

      {/* Price Range */}
      <div className="mb-4">
        <p className="small fw-bold text-uppercase text-muted mb-3" style={{ fontSize: "0.75rem" }}>
          Price Range (₹)
        </p>

        <div className="row g-2">
          <div className="col-6">
            <label className="form-label small text-muted mb-1" style={{ fontSize: "0.7rem" }}>Starting</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handlePriceChange}
              className="form-control form-control-sm border-0 bg-light"
              placeholder="₹100"
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>
          <div className="col-6">
            <label className="form-label small text-muted mb-1" style={{ fontSize: "0.7rem" }}>Maximum</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handlePriceChange}
              className="form-control form-control-sm border-0 bg-light"
              placeholder="₹1000"
              style={{ borderRadius: "8px", padding: "10px" }}
            />
          </div>
        </div>
      </div>

      <hr style={{ opacity: "0.1" }} />

      {/* Bus Type */}
      <div className="mb-4">
        <p className="small fw-bold text-uppercase text-muted mb-3" style={{ fontSize: "0.75rem" }}>
          Bus Type
        </p>

        <div className="d-flex flex-column gap-1">
          {["Ac sleeper", "Non AC", "Sleeper", "Seater"].map((type) => (
            <div 
              className="form-check p-2" 
              key={type}
              style={{ 
                borderRadius: "8px", 
                backgroundColor: filters.busTypes.includes(type) ? "#e0f2fe" : "transparent",
                transition: "0.3s ease",
                cursor: "pointer"
              }}
            >
              <input
                className="form-check-input ms-1 me-2"
                type="checkbox"
                id={type}
                value={type}
                checked={filters.busTypes.includes(type)}
                onChange={handleBusTypeChange}
                style={{ cursor: "pointer" }}
              />
              <label 
                className="form-check-label small text-dark w-100" 
                htmlFor={type}
                style={{ cursor: "pointer", fontWeight: filters.busTypes.includes(type) ? "600" : "400" }}
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button 
        type="submit" 
        className="btn w-100 py-2 fw-bold text-white shadow-sm"
        style={{ 
          backgroundColor: "#0077b6", 
          borderRadius: "10px", 
          border: "none",
          marginTop: "10px"
        }}
      >
        Apply Filters
      </button>
    </form>
  );
}

export default FiltersContent;