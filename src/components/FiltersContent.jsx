import React, { useState } from "react";

function FiltersContent({onApplyFilters}) {
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
    setFilters({
      minPrice: "",
      maxPrice: "",
      busTypes: [],
    });
    console.log("clearing the details ",filters)

    onApplyFilters({
      minPrice: "",
      maxPrice: "",
      busTypes: [],
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold m-0">Filters</h5>
        <button
          type="button"
          onClick={handleClear}
          className="btn btn-link btn-sm text-danger p-0 text-decoration-none fw-bold"
        >
          CLEAR ALL
        </button>
      </div>

      <hr />

      {/* Price Range */}
      <div className="mb-4">
        <p className="small fw-bold text-uppercase text-muted mb-3">
          Price Range
        </p>

        <div className="mb-3">
          <label className="form-label small">Starting Price</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handlePriceChange}
            className="form-control form-control-sm"
            placeholder="₹100"
          />
        </div>

        <div>
          <label className="form-label small">Maximum Price</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handlePriceChange}
            className="form-control form-control-sm"
            placeholder="₹1000"
          />
        </div>
      </div>

      <hr />

      {/* Bus Type */}
      <div className="mb-4">
        <p className="small fw-bold text-uppercase text-muted mb-2">
          Bus Type
        </p>

        {["Ac sleeper", "Non AC", "Sleeper", "Seater"].map((type) => (
          <div className="form-check mb-2" key={type}>
            <input
              className="form-check-input"
              type="checkbox"
              value={type}
              checked={filters.busTypes.includes(type)}
              onChange={handleBusTypeChange}
            />
            <label className="form-check-label small">{type}</label>
          </div>
        ))}
      </div>

      <button type="submit" className="btn btn-primary btn-sm w-100">
        Apply Filters
      </button>
    </form>
  );
}

export default FiltersContent;