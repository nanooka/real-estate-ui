import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  if (currentUser) fetch();

  return (
    <nav>
      <div className="nav-div">
        <div className="left">
          <Link to="/" className="logo">
            <img src="/estate.png" alt="" />
            <span>RealEstate</span>
          </Link>

          {/* <Link to="/">Home</Link>
        <Link to="/">About</Link>
        <Link to="/">Contact</Link>
        <Link to="/">Agents</Link> */}
          <Link to="/listing">Listing</Link>
          <Link to="/about">About Us</Link>
          <Link to="/">Help</Link>
        </div>
        <div className="right">
          {currentUser ? (
            <div className="user">
              <img src={currentUser.avatar || "/noavatar.jpg"} alt="" />
              <span>{currentUser.username}</span>
              <Link to="/profile" className="profile">
                {number > 0 && <div className="notification">{number}</div>}
                <span>Profile</span>
              </Link>
            </div>
          ) : (
            <Link to="/login" className="login">
              Log in
            </Link>
          )}
          <div className="menuIcon">
            <img src="/menu.png" alt="" onClick={() => setOpen(!open)} />
          </div>
          <div className={open ? "menu active" : "menu"}>
            <Link to="/">Home</Link>
            <Link to="/">About</Link>
            <Link to="/">Contact</Link>
            <Link to="/">Agents</Link>
            <Link to="/">Sign in</Link>
            <Link to="/">Sign up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
