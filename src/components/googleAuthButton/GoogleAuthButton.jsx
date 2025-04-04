import { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google"; // Google Auth Library
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";

const GoogleAuthButton = () => {
  const { updateUser } = useContext(AuthContext); // Get updateUser function
  const navigate = useNavigate(); // Get navigation function

  const handleGoogleSuccess = async (response) => {
    const { credential } = response;

    try {
      const res = await apiRequest.post("/auth/google", { credential });

      updateUser(res.data.user); // ✅ Store user in AuthContext
      navigate("/"); // ✅ Redirect user after login
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => console.log("Google login failed")}
    />
  );
};

export default GoogleAuthButton;
