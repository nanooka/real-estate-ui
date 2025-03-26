import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import { formatWithSpaces } from "../../lib/formatPrice";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={defaultIcon}>
      <Popup>
        <Link to={`/${item.id}`}>
          <div className="popupContainer">
            <img src={item.images[0]} alt="" />
            <div className="textContainer">
              <b>{item.title}</b>
              <span>{item.bedroom} bedroom</span>
              <b>$ {formatWithSpaces(item.price)}</b>
            </div>
          </div>
        </Link>
      </Popup>
    </Marker>
  );
}
