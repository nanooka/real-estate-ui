import { SlLocationPin } from "react-icons/sl";
import { BiBath } from "react-icons/bi";
import { formatWithSpaces } from "../../lib/formatPrice";
import "./card.scss";
import { Link } from "react-router-dom";
import { IoBedOutline } from "react-icons/io5";

export default function Card({ item }) {
  return (
    <Link to={`/${item.id}`}>
      <div className="card">
        <div className="imageContainer">
          <img src={item.images[0]} alt="" />
        </div>
        <div className="textContainer">
          <h2 className="title">{item.title}</h2>
          <p className="price">$ {formatWithSpaces(item.price)}</p>
          <p className="address">
            <SlLocationPin color="#888" size={18} />
            <span>{item.address}</span>
          </p>

          <div className="bottom">
            <div className="features">
              <div className="feature">
                {/* <img src="/bed.png" alt="" /> */}
                <IoBedOutline color="#888" size={18} />
                <span>{item.bedroom}</span>
              </div>

              <div className="feature">
                {/* <img src="/bath.png" alt="" /> */}
                <BiBath color="#888" size={18} />
                <span>{item.bathroom}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
