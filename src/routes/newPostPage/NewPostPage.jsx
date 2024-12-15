import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "leaflet-control-geocoder";
import PinAddressMap from "../../components/pinAddressMap/PinAddressMap";
import { fetchCities, fetchCountries } from "../../lib/location";

export default function NewPostPage() {
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [descValue, setDescValue] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  console.log(descValue);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryList = await fetchCountries();
        setCountries(countryList);
      } catch (err) {
        console.log(err);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      // setFilteredCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        const cityList = await fetchCities(selectedCountry);
        setCities(cityList);
        // setFilteredCities(cityList);
      } catch (error) {
        console.error(error);
        setCities([]);
      }
    };

    loadCities();
  }, [selectedCountry]);

  // console.log(coordinates);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          // desc: inputs.desc,
          desc: descValue,
          price: parseInt(inputs.price),
          address: inputs.address,
          country: inputs.country,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          status: inputs.status,
          propertyType: inputs.propertyType,
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString(),
          images: images,
          area: parseInt(inputs.area),
        },
        // postDetail: {
        //   // desc: value,
        //   desc: inputs.desc,
        //   utilities: inputs.utilities,
        //   pet: inputs.pet,
        //   income: inputs.income,
        //   school: parseInt(inputs.school),
        //   bus: parseInt(inputs.bus),
        //   restaurant: parseInt(inputs.restaurant),
        // },
      });
      navigate(`/${res.data.id}`);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "An unexpected error occurred.");
    }
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" required />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" required />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" required />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              {/* <textarea name="desc" id="desc"></textarea> */}
              <ReactQuill
                theme="snow"
                onChange={setDescValue}
                value={descValue}
              />
            </div>

            <div className="item">
              <label htmlFor="country">Country</label>
              <select
                name="country"
                id="country"
                value={selectedCountry}
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity("");
                }}
                required
              >
                <option value="" disabled>
                  Select country
                </option>
                {countries.map((country) => (
                  <option key={country}>{country}</option>
                ))}
              </select>
            </div>

            <div className="item">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                required
                disabled={!selectedCountry || cities.length === 0}
              >
                <option value="" disabled>
                  {selectedCountry ? "Select city" : "Select country First"}
                </option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input
                min={1}
                id="bedroom"
                name="bedroom"
                type="number"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input
                min={1}
                id="bathroom"
                name="bathroom"
                type="number"
                required
              />
            </div>
            <div className="item">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" required>
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="sale">Sale</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="propertyType">Property</label>
              <select id="propertyType" name="propertyType" required>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
              </select>
            </div>

            <div className="item">
              <label htmlFor="area">Area (m²)</label>
              <input min={0} id="area" name="area" type="number" required />
            </div>

            <PinAddressMap
              setCoordinates={setCoordinates}
              city={selectedCity}
            />
            <button className="sendButton">Add</button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images?.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            cloudName: "dg04baaoh",
            uploadPreset: "estate",
            multiple: true,
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
}
