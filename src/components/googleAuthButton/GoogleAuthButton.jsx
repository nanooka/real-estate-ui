import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Google Auth Library
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import "./googleAuthButton.scss";

const GoogleAuthButton = () => {
  const { updateUser } = useContext(AuthContext); // Get updateUser function
  const navigate = useNavigate(); // Get navigation function

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;

    try {
      const res = await apiRequest.post("/auth/google", { credential });

      updateUser(res.data.user);
      const fallback =
        location.state?.from && location.state.from.startsWith("/")
          ? location.state.from
          : "/";
      navigate(fallback);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => console.log("Google login failed")}
        // theme="filled_black"
        shape="pill"
      />
    </div>
  );
};

export default GoogleAuthButton;
