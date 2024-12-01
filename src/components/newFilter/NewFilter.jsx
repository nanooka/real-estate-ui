import "./newFilter.scss";
import { fetchCountries, fetchCities } from "../../lib/location";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { BiArea } from "react-icons/bi";

export default function NewFilter() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [countryInputValue, setCountryInputValue] = useState("");
  const [cityInputValue, setCityInputValue] = useState("");
  const [query, setQuery] = useState({
    status: "",
    country: "",
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    bedroom: "",
  });

  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryList = await fetchCountries();
        setCountries(countryList);
        setFilteredCountries(countryList);
      } catch (err) {
        console.log(err);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!query.country) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        const cityList = await fetchCities(query.country);
        setCities(cityList);
        setFilteredCities(cityList);
      } catch (error) {
        console.error(error);
        setCities([]);
      }
    };

    loadCities();
  }, [query.country]);

  const toggleDropdown = (key) => {
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleQueryUpdate = (key, value, closeDropdown = true) => {
    setQuery((prevQuery) => ({
      ...prevQuery,
      [key]: value,
    }));
    if (closeDropdown) {
      setActiveDropdown(null);
    }
  };

  const handleFilter = () => {
    const filteredQuery = Object.fromEntries(
      // eslint-disable-next-line no-unused-vars
      Object.entries(query).filter(([_, value]) => value)
    );
    const queryString = new URLSearchParams(filteredQuery).toString();
    navigate(`/listing?${queryString}`);
  };

  const handleInputChange = (type, value) => {
    const inputValue = value.toLowerCase();
    if (type === "country") {
      setCountryInputValue(value);
      const filtered = countries.filter((country) =>
        country.toLowerCase().startsWith(inputValue)
      );
      setFilteredCountries(filtered);
    } else if (type === "city") {
      setCityInputValue(value);
      const filtered = cities.filter((city) =>
        city.toLowerCase().startsWith(inputValue)
      );
      setFilteredCities(filtered);
    }
  };

  const handleSelect = (type, value) => {
    if (type === "country") {
      setQuery((prevQuery) => ({
        ...prevQuery,
        country: value,
        city: "",
      }));
      setCountryInputValue(value);
      setFilteredCountries(countries);
    } else if (type === "city") {
      setQuery((prevQuery) => ({
        ...prevQuery,
        city: value,
      }));
      setCityInputValue(value);
      setFilteredCities(cities);
    }
    setActiveDropdown(null);
  };

  return (
    <div className="filterContainer" ref={dropdownRef}>
      {/* Status Dropdown */}
      <div className="dropdown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "status" ? "active" : ""
          }`}
          style={{
            color: query.status && "#004da3",
            fontWeight: query.status && "bold",
          }}
          onClick={() => toggleDropdown("status")}
        >
          {query.status ? "For " + query.status : "Status"}
        </div>
        {activeDropdown === "status" && (
          <ul className="dropdownList">
            <li onClick={() => handleQueryUpdate("status", "sale")}>
              For sale
            </li>
            <li onClick={() => handleQueryUpdate("status", "rent")}>
              For rent
            </li>
          </ul>
        )}
      </div>
      {/* Property Type Dropdown */}
      <div className="dropdown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "propertyType" ? "active" : ""
          }`}
          style={{
            color: query.propertyType && "#004da3",
            fontWeight: query.propertyType && "bold",
          }}
          onClick={() => toggleDropdown("propertyType")}
        >
          {query.propertyType.charAt(0).toUpperCase() +
            query.propertyType.slice(1) || "Property Type"}
        </div>
        {activeDropdown === "propertyType" && (
          <ul className="dropdownList">
            <li onClick={() => handleQueryUpdate("propertyType", "apartment")}>
              Apartment
            </li>
            <li onClick={() => handleQueryUpdate("propertyType", "house")}>
              House
            </li>
          </ul>
        )}
      </div>
      {/* Country Dropdown */}
      <div className="dropdown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "country" ? "active" : ""
          }`}
          style={{
            color: query.country && "#004da3",
            fontWeight: query.country && "bold",
          }}
          onClick={() => toggleDropdown("country")}
        >
          {query.country || "Country"}
        </div>

        {activeDropdown === "country" && (
          <>
            <input
              ref={countryInputRef}
              type="text"
              placeholder="Enter country"
              value={countryInputValue}
              onChange={(e) => handleInputChange("country", e.target.value)}
              autoFocus
            />
            <ul className="dropdownList">
              {filteredCountries.map((country) => (
                <li
                  key={country}
                  onClick={() => handleSelect("country", country)}
                >
                  {country}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {/* City Dropdown */}
      {query.country && (
        <div className="dropdown">
          <div
            className={`dropdownHeader ${
              activeDropdown === "city" ? "active" : ""
            }`}
            style={{
              color: query.city && "#004da3",
              fontWeight: query.city && "bold",
            }}
            onClick={() => toggleDropdown("city")}
          >
            {query.city || "City"}
          </div>
          {activeDropdown === "city" && (
            <>
              <input
                ref={cityInputRef}
                type="text"
                placeholder="Enter city"
                value={cityInputValue}
                onChange={(e) => handleInputChange("city", e.target.value)}
                autoFocus
              />
              <ul className="dropdownList">
                {filteredCities.map((city) => (
                  <li key={city} onClick={() => handleSelect("city", city)}>
                    {city}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      {/* Price Dropdown */}
      <div className="dropdown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "price" ? "active" : ""
          }`}
          onClick={() => toggleDropdown("price")}
        >
          {query.minPrice && query.maxPrice
            ? query.minPrice + " - " + query.maxPrice
            : query.minPrice && !query.maxPrice
            ? query.minPrice + "+"
            : !query.minPrice && query.maxPrice
            ? "-" + query.maxPrice
            : "Price"}
          <span>$</span>
        </div>

        {activeDropdown === "price" && (
          <div className="priceDropdown">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={query.minPrice || ""}
              onChange={(e) =>
                handleQueryUpdate("minPrice", e.target.value, false)
              }
              autoFocus
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={query.maxPrice || ""}
              onChange={(e) =>
                handleQueryUpdate("maxPrice", e.target.value, false)
              }
            />
          </div>
        )}
      </div>
      {/* Area Dropdown */}
      <div className="dropdown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "area" ? "active" : ""
          }`}
          onClick={() => toggleDropdown("area")}
        >
          {query.minArea && query.maxArea
            ? query.minArea + " - " + query.maxArea
            : query.minArea && !query.maxArea
            ? query.minArea + "+"
            : !query.minArea && query.maxArea
            ? "-" + query.maxArea
            : "Area"}
          <BiArea size={20} color="#007bff" />
        </div>

        {activeDropdown === "area" && (
          <div className="areaDropdown">
            <input
              type="number"
              name="minArea"
              placeholder="Min area"
              value={query.minArea || ""}
              onChange={(e) =>
                handleQueryUpdate("minArea", e.target.value, false)
              }
              autoFocus
            />
            <input
              type="number"
              name="MaxArea"
              placeholder="Max area"
              value={query.maxArea || ""}
              onChange={(e) =>
                handleQueryUpdate("maxArea", e.target.value, false)
              }
            />
            <input
              type="number"
              name="bedroom"
              placeholder="Bedrooms"
              value={query.bedroom || ""}
              onChange={(e) =>
                handleQueryUpdate("bedroom", e.target.value, false)
              }
            />
          </div>
        )}
      </div>

      <button onClick={handleFilter}>
        <CiSearch size={28} />
      </button>
    </div>
  );
}
