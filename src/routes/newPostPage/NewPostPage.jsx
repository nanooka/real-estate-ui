import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import L from "leaflet";
import "leaflet-control-geocoder";

export default function NewPostPage() {
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: "", lng: "" });
  // const geocoderRef = useRef(null);

  const navigate = useNavigate();

  const handleGeocode = (address) => {
    if (!address) {
      setError("Address is required for geocoding.");
      return;
    }

    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(address, (results) => {
      if (results.length > 0) {
        const { center } = results[0];
        setCoordinates({ lat: center.lat, lng: center.lng });
      } else {
        setError("Unable to fetch coordinates. Please check the address.");
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);
    console.log(coordinates);

    try {
      setLoading(true);

      // Trigger geocoding if coordinates are not set
      if (!coordinates.lat || !coordinates.lng) {
        handleGeocode(`${inputs.address}, ${inputs.city}`);
        return; // Wait for geocoding
      }

      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price),
          address: inputs.address,
          city: inputs.city,
          bedroom: parseInt(inputs.bedroom),
          bathroom: parseInt(inputs.bathroom),
          type: inputs.type,
          property: inputs.property,
          // latitude: inputs.latitude,
          // longitude: inputs.longitude,
          latitude: coordinates.lat.toString(),
          longitude: coordinates.lng.toString(),
          images: images,
        },
        postDetail: {
          // desc: value,
          desc: inputs.desc,
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income,
          size: parseInt(inputs.size),
          school: parseInt(inputs.school),
          bus: parseInt(inputs.bus),
          restaurant: parseInt(inputs.restaurant),
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
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input id="price" name="price" type="number" />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                onBlur={(e) => handleGeocode(e.target.value)}
              />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <textarea name="desc" id="desc"></textarea>
              {/* <ReactQuill theme="snow" onChange={setValue} value={value} /> */}
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <input id="city" name="city" type="text" />
            </div>
            <div className="item">
              <label htmlFor="bedroom">Bedroom Number</label>
              <input min={1} id="bedroom" name="bedroom" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bathroom">Bathroom Number</label>
              <input min={1} id="bathroom" name="bathroom" type="number" />
            </div>
            {/* <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input id="latitude" name="latitude" type="text" />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input id="longitude" name="longitude" type="text" />
            </div> */}
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select name="property">
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (sqft)</label>
              <input min={0} id="size" name="size" type="number" />
            </div>
            <div className="item">
              <label htmlFor="school">School</label>
              <input min={0} id="school" name="school" type="number" />
            </div>
            <div className="item">
              <label htmlFor="bus">bus</label>
              <input min={0} id="bus" name="bus" type="number" />
            </div>
            <div className="item">
              <label htmlFor="restaurant">Restaurant</label>
              <input min={0} id="restaurant" name="restaurant" type="number" />
            </div>
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
