import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function PinAddressMap({ setCoordinates, city }) {
  const [position, setPosition] = useState(null); // Store the pin position
  const [center, setCenter] = useState([40.713, -74.0132]);

  // Geocode the city when it changes
  console.log("center", center);
  useEffect(() => {
    if (!city) return;

    const fetchCityCoordinates = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
            city
          )}&format=json`
        );
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon } = data[0];
          setCenter([parseFloat(lat), parseFloat(lon)]); // Update center
        } else {
          console.error("City not found");
        }
      } catch (err) {
        console.error("Error fetching city coordinates:", err);
      }
    };

    fetchCityCoordinates();
  }, [city]);

  // Custom hook for handling map clicks
  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng }); // Update the pin position
        setCoordinates({ lat, lng }); // Pass the coordinates to parent component or form
      },
    });
    return null;
  };

  const DynamicMapCenter = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(center); // Update the map's view to the new center
    }, [map]);
    return null;
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <LocationSelector />
      <DynamicMapCenter />
      {position && <Marker position={[position.lat, position.lng]} />}
    </MapContainer>
  );
}
