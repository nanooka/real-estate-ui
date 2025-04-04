import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import GoogleAuthButton from "../../components/googleAuthButton/GoogleAuthButton";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

export default function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
        phone,
      });

      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSuccess = async (response) => {
  //   const { credential } = response;

  //   try {
  //     const res = await apiRequest.post("/auth/google", { credential });

  //     // After successful Google authentication, redirect the user to login or home page
  //     navigate("/login");
  //   } catch (err) {
  //     console.log(err);
  //     setError("Failed to authenticate with Google");
  //   }
  // };

  // const handleGoogleFailure = (error) => {
  //   console.log(error);
  //   setError("Google login failed");
  // };

  // const handleGoogleSuccess = async (response) => {
  //   const { credential } = response;

  //   try {
  //     // Decode the Google JWT token to extract user data
  //     const decodedToken = jwtDecode(credential);

  //     // const userData = {
  //     //   username: decodedToken.name,
  //     //   email: decodedToken.email,
  //     //   // avatar: decodedToken.picture,
  //     //   // googleId: decodedToken.sub, // Unique Google ID
  //     //   password: "",
  //     //   phone: "",
  //     // };

  //     const body = {
  //       clientId: clientID,
  //       credential,
  //     };

  //     // Send the user data to your backend for registration or login
  //     const res = await apiRequest.post("/auth/google", body);

  //     // After successful Google authentication, redirect to login or home page
  //     navigate("/");
  //   } catch (err) {
  //     console.log(err);
  //     setError("Failed to authenticate with Google");
  //   }
  // };

  // const handleGoogleSuccess = async (response) => {
  //   const { credential } = response;

  //   try {
  //     // Decode the Google JWT token to extract user data
  //     const decodedToken = jwtDecode(credential);

  //     const userData = {
  //       username: decodedToken.name,
  //       email: decodedToken.email,
  //       avatar: decodedToken.picture,
  //       googleId: decodedToken.sub, // Unique Google ID
  //     };

  //     // Send the user data to your backend for registration or login
  //     const res = await apiRequest.post("/auth/google", userData);

  //     // After successful Google authentication, redirect to login or home page
  //     navigate("/login");
  //   } catch (err) {
  //     console.log(err);
  //     setError("Failed to authenticate with Google");
  //   }
  // };

  return (
    // <GoogleOAuthProvider clientId={clientID}>
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            minLength={3}
            maxLength={20}
          />
          <input name="email" type="email" placeholder="Email" required />
          <input name="phone" type="text" placeholder="Phone" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button disabled={isLoading}>Register</button>
          {error && <span>{error}</span>}
          <Link to="/login">Do you have an account?</Link>
          {/* <GoogleLogin
            // clientId="444328820638-8sph7m2pi6ir7np8k3flvhdofamqlr7p.apps.googleusercontent.com" // Replace with your Google Client ID
            // buttonText="Sign Up with Google"
            onSuccess={handleGoogleSuccess}
            // onFailure={handleGoogleFailure}
            // cookiePolicy={"single_host_origin"}
            // onSuccess={handleGoogleSuccess}
            // onSuccess={(credentialResponse) =>
            //   console.log(jwtDecode(credentialResponse.credential))
            // }
            // onSuccess={(credentialResponse) =>
            //   console.log(credentialResponse.credential)
            // }
            onError={handleGoogleFailure}
            auto_select={true}
            // useOneTap
          /> */}

          <GoogleAuthButton />
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
    // </GoogleOAuthProvider>
  );
}
