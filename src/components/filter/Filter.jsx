import "./filter.scss";
import { fetchCountries, fetchCities } from "../../lib/location";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { BiArea } from "react-icons/bi";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LiaBedSolid } from "react-icons/lia";

export default function Filter() {
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

  console.log(query);

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
    navigate(`/?${queryString}`);
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
            // color: query.status && "#004da3",
            color: query.status && "var(--primary-color)",
            fontWeight: query.status && "bold",
          }}
          onClick={() => toggleDropdown("status")}
        >
          {query.status ? "For " + query.status : "Status"}
          <MdKeyboardArrowDown
            size={20}
            color="var(--primary-color)"
            style={{
              transform: activeDropdown === "status" && "rotate(-180deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>
        {activeDropdown === "status" && (
          <ul className="dropdownList">
            <li
              onClick={() => handleQueryUpdate("status", "sale")}
              style={{
                backgroundColor:
                  query.status === "sale" && "var(--primary-color)",
                color: query.status === "sale" && "white",
              }}
            >
              For sale
            </li>
            <li
              onClick={() => handleQueryUpdate("status", "rent")}
              style={{
                backgroundColor:
                  query.status === "rent" && "var(--primary-color)",
                color: query.status === "rent" && "white",
              }}
            >
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
            // color: query.propertyType && "#004da3",
            color: query.propertyType && "var(--primary-color)",
            fontWeight: query.propertyType && "bold",
          }}
          onClick={() => toggleDropdown("propertyType")}
        >
          {query.propertyType.charAt(0).toUpperCase() +
            query.propertyType.slice(1) || "Property Type"}
          <MdKeyboardArrowDown
            size={20}
            color="var(--primary-color)"
            style={{
              transform: activeDropdown === "propertyType" && "rotate(-180deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>
        {activeDropdown === "propertyType" && (
          <ul className="dropdownList">
            <li
              onClick={() => handleQueryUpdate("propertyType", "apartment")}
              style={{
                backgroundColor:
                  query.propertyType === "apartment" && "var(--primary-color)",
                color: query.propertyType === "apartment" && "white",
              }}
            >
              Apartment
            </li>
            <li
              onClick={() => handleQueryUpdate("propertyType", "house")}
              style={{
                backgroundColor:
                  query.propertyType === "house" && "var(--primary-color)",
                color: query.propertyType === "house" && "white",
              }}
            >
              House
            </li>
          </ul>
        )}
      </div>

      {/* Country Dropdown */}
      <div className="dropdown countryDropDown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "country" ? "active" : ""
          }`}
          style={{
            // color: query.country && "#004da3",
            color: query.country && "var(--primary-color)",
            fontWeight: query.country && "bold",
          }}
          onClick={() => toggleDropdown("country")}
        >
          {query.country || "Country"}
          <MdKeyboardArrowDown
            size={20}
            color="var(--primary-color)"
            style={{
              transform: activeDropdown === "country" && "rotate(-180deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
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
            <ul className="dropdownList country">
              {filteredCountries.map((country) => (
                <li
                  key={country}
                  onClick={() => handleSelect("country", country)}
                  style={{
                    backgroundColor:
                      query.country === country && "var(--primary-color)",
                    color: query.country === country && "white",
                  }}
                >
                  {country}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* City Dropdown */}
      {/* {query.country && ( */}
      <div className="dropdown cityDropDown">
        <div
          className={`dropdownHeader ${
            activeDropdown === "city" ? "active" : ""
          }`}
          style={{
            // color: query.city && "#004da3",
            color: query.city && "var(--primary-color)",
            fontWeight: query.city && "bold",
          }}
          onClick={() => toggleDropdown("city")}
        >
          {query.city || "City"}
          <MdKeyboardArrowDown
            size={20}
            color="var(--primary-color)"
            style={{
              transform: activeDropdown === "city" && "rotate(-180deg)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
        </div>
        {activeDropdown === "city" && (
          <>
            {query.country ? (
              <>
                <input
                  ref={cityInputRef}
                  type="text"
                  placeholder="Enter city"
                  value={cityInputValue}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  autoFocus
                />
                <ul className="dropdownList city">
                  {filteredCities.map((city) => (
                    <li
                      key={city}
                      onClick={() => handleSelect("city", city)}
                      style={{
                        backgroundColor:
                          query.city === city && "var(--primary-color)",
                        color: query.city === city && "white",
                      }}
                    >
                      {city}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="cityAltDiv">Select country first</div>
            )}
          </>
        )}
      </div>
      {/* )} */}

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
            ? "<" + query.maxPrice
            : "Price"}
          <span>$</span>
        </div>

        {activeDropdown === "price" && (
          <div className="priceDropdown">
            <input
              type="number"
              name="minPrice"
              placeholder="Min price"
              value={query.minPrice || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 8) {
                  handleQueryUpdate("minPrice", value, false);
                }
              }}
              autoFocus
              min={0}
              max={99999999}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder="Max price"
              value={query.maxPrice || ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 8) {
                  handleQueryUpdate("maxPrice", value, false);
                }
              }}
              min={query.minPrice || 0}
              max={99999999}
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
            ? "<" + query.maxArea
            : "Area (m²)"}
          <div>
            {query.bedroom && (
              <>
                <LiaBedSolid size={20} color="var(--primary-color)" />
                <span>{query.bedroom}</span>
              </>
            )}

            <BiArea size={20} color="var(--primary-color)" />
          </div>
        </div>

        {activeDropdown === "area" && (
          <div className="areaDropdown">
            <div className="areaInputs">
              <input
                type="number"
                name="minArea"
                placeholder="Min area"
                value={query.minArea || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 4) {
                    handleQueryUpdate("minArea", value, false);
                  }
                }}
                autoFocus
              />
              <input
                type="number"
                name="MaxArea"
                placeholder="Max area"
                value={query.maxArea || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 4) {
                    handleQueryUpdate("maxArea", value, false);
                  }
                }}
              />
            </div>
            <div className="dropdownList bedroom-selector">
              <span>Bedrooms </span>
              {/* <MdOutlineBedroomParent size={20} /> */}

              <div className="bedroom-list">
                {Array.from({ length: 6 }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    className={`bedroom-btn ${
                      query.bedroom === num ? "selected" : ""
                    }`}
                    onClick={() => handleQueryUpdate("bedroom", num, false)}
                  >
                    {num === 6 ? num + "+" : num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <button onClick={handleFilter} className="search-btn">
        <CiSearch size={28} />
      </button>
    </div>
  );
}
