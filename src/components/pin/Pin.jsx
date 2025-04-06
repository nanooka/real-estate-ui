import { Marker, Popup } from "react-leaflet";
import "./pin.scss";
import { Link } from "react-router-dom";
import { formatWithSpaces } from "../../lib/formatPrice";

export default function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]}>
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
