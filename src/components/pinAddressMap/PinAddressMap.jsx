import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./pinAddressMap.scss";

export default function PinAddressMap({ setCoordinates, city, setAddress }) {
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState([40.713, -74.0132]);

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
          setCenter([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.error("City not found");
        }
      } catch (err) {
        console.error("Error fetching city coordinates:", err);
      }
    };

    fetchCityCoordinates();
  }, [city]);

  const LocationSelector = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        setCoordinates({ lat, lng });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );
          const data = await response.json();

          if (data && data.address) {
            const { house_number, road, city, state, postcode } = data.address;

            const addressParts = [
              house_number ? house_number + " " + road : road,
              city,
              state,
              postcode,
            ].filter(Boolean);

            const fullAddress = addressParts.join(", ");
            console.log("Pinned Address:", fullAddress);
            setAddress(fullAddress);
          }
        } catch (err) {
          console.error("Error fetching address:", err);
        }
      },
    });
    return null;
  };

  const DynamicMapCenter = () => {
    const map = useMap();
    useEffect(() => {
      map.setView(center);
    }, [map]);
    return null;
  };

  return (
    <MapContainer center={center} zoom={13} className="map">
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
