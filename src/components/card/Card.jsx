import { formatWithSpaces } from "../../lib/formatPrice";
import "./card.scss";
import { Link } from "react-router-dom";

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
            <img src="/pin.png" alt="" />
            <span>
              {item.address}, {item.city}
            </span>
          </p>

          <div className="bottom">
            <div className="features">
              <div className="feature">
                <img src="/bed.png" alt="" />
                <span>{item.bedroom}</span>
              </div>

              <div className="feature">
                <img src="/bath.png" alt="" />
                <span>{item.bathroom}</span>
              </div>
            </div>
            {/* <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div> */}
          </div>
        </div>
      </div>
    </Link>
  );
}
