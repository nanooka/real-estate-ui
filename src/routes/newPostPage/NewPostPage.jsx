import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newPostPage.scss";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import "leaflet-control-geocoder";
import PinAddressMap from "../../components/pinAddressMap/PinAddressMap";
import { fetchCities, fetchCountries } from "../../lib/location";
import Select from "react-select";
import { RiCloseLargeLine } from "react-icons/ri";

export default function NewPostPage() {
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
  const [address, setAddress] = useState("");
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countryList = await fetchCountries();
        const countryOptions = Object.entries(countryList).map((name) => ({
          value: name[1],
          label: name[1],
        }));
        setCountries(countryOptions);
      } catch (err) {
        console.log(err);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      try {
        const cityList = await fetchCities(selectedCountry.label);
        const cityOptions = Object.entries(cityList).map((name) => ({
          value: name[1],
          label: name[1],
        }));
        setCities(cityOptions);
      } catch (error) {
        console.error(error);
        setCities([]);
      }
    };

    loadCities();
  }, [selectedCountry]);

  const handleDeleteImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          desc: inputs.desc,
          // desc: descValue,
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
            <div className="item-section">
              <div className="item">
                <span>Country</span>

                <Select
                  classNamePrefix="custom-select"
                  options={countries}
                  value={selectedCountry}
                  onChange={setSelectedCountry}
                  placeholder=""
                  isClearable
                  required
                  name="country"
                  autoComplete="country"
                />
              </div>

              <div className="item">
                <span>City</span>
                <Select
                  classNamePrefix="custom-select"
                  options={cities}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder=""
                  isClearable
                  isDisabled={!selectedCountry}
                  required
                  name="city"
                  autoComplete="city"
                />
              </div>
            </div>

            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                required
                autoComplete="address"
                value={address && address}
                onChange={(e) => e.target.value}
              />
            </div>

            <div className="big-item-section">
              <div className="item">
                <label htmlFor="area">Area (m²)</label>
                <input
                  min={0}
                  id="area"
                  name="area"
                  type="number"
                  required
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="item">
                <label htmlFor="bedroom">Bedroom/s</label>
                <input
                  min={1}
                  id="bedroom"
                  name="bedroom"
                  type="number"
                  required
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="item">
                <label htmlFor="bathroom">Bathroom/s</label>
                <input
                  min={1}
                  id="bathroom"
                  name="bathroom"
                  type="number"
                  required
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="item">
                <span>Status</span>

                <Select
                  classNamePrefix="custom-select"
                  options={[
                    { value: "rent", label: "For rent" },
                    { value: "sale", label: "For sale" },
                  ]}
                  name="status"
                  placeholder=""
                  required
                  autoComplete="off"
                />
              </div>

              <div className="item">
                <span>Property</span>

                <Select
                  classNamePrefix="custom-select"
                  options={[
                    { value: "apartment", label: "Apartment" },
                    { value: "house", label: "House" },
                  ]}
                  name="propertyType"
                  placeholder=""
                  autoComplete="off"
                  required
                />
              </div>

              <div className="item">
                <label htmlFor="price">Price</label>
                <input
                  min={1}
                  id="price"
                  name="price"
                  type="number"
                  required
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
                <span className="price-sign">$</span>
              </div>
            </div>

            <div className="item">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                autoComplete="off"
              />
            </div>

            <div className="item">
              <label htmlFor="desc">Description</label>
              <textarea name="desc" id="desc"></textarea>
            </div>

            <PinAddressMap
              setCoordinates={setCoordinates}
              city={selectedCity?.label}
              setAddress={setAddress}
            />
            <div className="imgContainer">
              <div className="uploadedImages">
                {images?.map((image, index) => (
                  <div key={index} className="image">
                    <img src={image} alt="" />
                    <div
                      className="deleteImage"
                      onClick={() => handleDeleteImage(index)}
                    >
                      <RiCloseLargeLine color="black" />
                    </div>
                  </div>
                ))}
              </div>
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
            <button className="addButton" type="submit">
              Add Post
            </button>
            {error && <span>{error}</span>}
          </form>
        </div>
      </div>
    </div>
  );
}
