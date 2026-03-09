import React, { useState, useEffect } from "react";

function Profile() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries")
      .then(res => res.json())
      .then(data => {
        const india = data.data.find(
          (country) => country.country === "India"
        );
        if (india) {
          setCities(india.cities); // store cities
        }
      });
  }, []);

  return (
    <div className="container mt-5">
      <label>From:</label>
      <input
        type="text"
        list="cityList"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
      />

      <label className="mx-5">To:</label>
      <input
        type="text"
        list="cityList"
        value={to}
        onChange={(e) => setTo(e.target.value)}
      />

      <datalist id="cityList">
        {cities.map((city, index) => (
          <option  key={index} value={city} />
        ))}
      </datalist>
    </div>
  );
}

export default Profile;