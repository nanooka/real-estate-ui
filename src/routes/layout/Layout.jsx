import "./layout.scss";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import ScrollToTop from "../../components/ScrollToTop";

function Layout() {
  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <ScrollToTop />
        <Outlet />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);

  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export { Layout, RequireAuth };
