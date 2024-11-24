import { useNavigate } from "react-router-dom";
import "./newFilter.scss";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

export default function NewFilter() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  //   const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  //   const [query, setQuery] = useState({
  //     status: searchParams.get("status") || "",
  //     country: searchParams.get("country") || "",
  //     city: searchParams.get("city") || "",
  //     propertyType: searchParams.get("propertyType") || "",
  //     minPrice: searchParams.get("minPrice") || 0,
  //     maxPrice: searchParams.get("maxPrice") || 10000000,
  //   });

  const [query, setQuery] = useState({
    // status: "",
    country: "",
    city: "",
    propertyType: "",
    minPrice: 0,
    maxPrice: 10000000,
  });

  console.log(query);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const countryList = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(countryList);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!query.country) return;

    const fetchCities = async () => {
      try {
        const response = await fetch(
          `https://countriesnow.space/api/v0.1/countries/cities`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: query.country }),
          }
        );
        const data = await response.json();
        if (data.error) throw new Error(data.msg);
        const sortedCities = (data.data || []).sort((a, b) =>
          a.localeCompare(b)
        );
        setCities(sortedCities);
      } catch (error) {
        console.error("Error fetching cities:", error);
        setCities([]);
      }
    };

    fetchCities();
  }, [query.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevQuery) => ({
      ...prevQuery,
      [name]: value,
    }));
  };

  const handleFilter = () => {
    // setSearchParams(query);
    const queryString = new URLSearchParams(query).toString();
    navigate(`/listing?${queryString}`);
  };

  return (
    <div className="filterContainer">
      <select
        id="status"
        name="status"
        value={query.status}
        onChange={handleChange}
      >
        <option value="">Status</option>
        <option value="sale">For Sale</option>
        <option value="rent">For rent</option>
      </select>

      <select
        id="propertyType"
        name="propertyType"
        value={query.propertyType}
        onChange={handleChange}
      >
        <option value="">Property type</option>
        <option value="apartment">Apartment</option>
        <option value="house">House</option>
      </select>

      <select
        id="country"
        name="country"
        value={query.country}
        onChange={handleChange}
      >
        <option value="">Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {query.country && (
        <select
          id="city"
          name="city"
          value={query.city}
          onChange={handleChange}
        >
          <option value="">City</option>
          {cities.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      )}

      <input
        type="number"
        id="minPrice"
        name="minPrice"
        placeholder="min price"
        value={query.minPrice}
        onChange={handleChange}
      />

      <input
        type="number"
        id="maxPrice"
        name="maxPrice"
        placeholder="max price"
        value={query.maxPrice}
        onChange={handleChange}
      />

      <button onClick={handleFilter}>
        <CiSearch size={24} color="white" />
      </button>
    </div>
  );
}
