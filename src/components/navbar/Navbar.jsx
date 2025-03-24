import { useContext, useEffect, useRef, useState } from "react";
import "./navbar.scss";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import apiRequest from "../../lib/apiRequest";
import { IoIosLogOut, IoMdMenu } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import ThemeToggle from "../ThemeToggle/ThemeToggle";

export default function Navbar() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const { currentUser, updateUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const number = useNotificationStore((state) => state.number);

  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const menuIconRef = useRef(null);

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

      if (
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target) &&
        menuIconRef.current &&
        !menuIconRef.current.contains(event.target)
      ) {
        setHamburgerOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeHamburger = () => setHamburgerOpen(false);

  return (
    <nav>
      <div className="nav-div">
        <div className="left">
          <NavLink to="/" className="logo">
            <img src="/estate.png" alt="" />
            <span>PrimeEstate</span>
          </NavLink>
          <NavLink to="/aboutUs">About Us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/faqs">FAQs</NavLink>
        </div>
        <div className="right">
          <ThemeToggle />
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
                  <NavLink to="/profile" className="dropdown-item">
                    <CgProfile /> Profile
                  </NavLink>
                  <span onClick={handleLogout} className="dropdown-item logout">
                    <IoIosLogOut /> Log out
                  </span>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className="login">
              Log in
            </NavLink>
          )}
          <div
            className="menuIcon"
            onClick={() => setHamburgerOpen(!hamburgerOpen)}
          >
            <IoMdMenu size={24} />
          </div>

          <div
            className={hamburgerOpen ? "overlay active" : "overlay"}
            onClick={closeHamburger}
          ></div>

          <div
            ref={hamburgerRef}
            className={hamburgerOpen ? "menu active" : "menu"}
          >
            <NavLink to="/" onClick={closeHamburger}>
              Home
            </NavLink>
            <NavLink to="/aboutUs" onClick={closeHamburger}>
              About Us
            </NavLink>
            <NavLink to="/contact" onClick={closeHamburger}>
              Contact
            </NavLink>
            <NavLink to="/faqs" onClick={closeHamburger}>
              FAQs
            </NavLink>
            {currentUser && <NavLink to="/profile">Profile</NavLink>}
            {!currentUser ? (
              <NavLink to="/login" onClick={closeHamburger}>
                Log in
              </NavLink>
            ) : (
              <p
                onClick={() => {
                  handleLogout();
                  closeHamburger();
                }}
              >
                Log out
              </p>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
