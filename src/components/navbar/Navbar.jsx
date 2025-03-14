import { useContext, useEffect, useRef, useState } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";
import { IoIosLogOut } from "react-icons/io";
import { CgProfile } from "react-icons/cg";

export default function Navbar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  const dropdownRef = useRef(null);

  if (currentUser) fetch();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  return (
    <nav>
      <div className="nav-div">
        <div className="left">
          <Link to="/" className="logo">
            <img src="/estate.png" alt="" />
            <span>RealEstate</span>
          </Link>
          {/* <Link to="/listing">Listing</Link> */}
          <Link to="/about">About Us</Link>
          <Link to="/faqs">FAQs</Link>
          <Link to="/">Help</Link>
        </div>
        <div className="right">
          {currentUser ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <div
                className="user-info"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span>{currentUser.username}</span>
                <img src={currentUser.avatar || "/noavatar.jpg"} alt="Avatar" />
                {number > 0 && <div className="notification">{number}</div>}
              </div>
              {profileDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">
                    <CgProfile /> Profile
                  </Link>
                  <span onClick={handleLogout} className="dropdown-item logout">
                    <IoIosLogOut /> Logout
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login">
              Log in
            </Link>
          )}
          <div className="menuIcon">
            <img
              src="/menu.png"
              alt=""
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
            />
          </div>
          <div className={hamburgerOpen ? "menu active" : "menu"}>
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
