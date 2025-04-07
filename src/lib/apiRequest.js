import axios from "axios";

// const URL = import.meta.env.VITE_SERVER_URL_LOCAL;
const URL = import.meta.env.VITE_SERVER_URL_DEPLOYMENT;

const apiRequest = axios.create({
  // baseURL: "http://localhost:8800/api",
  // baseURL: "https://real-estate-nanooka.onrender.com/api",
  baseURL: URL,
  withCredentials: true,
});

export default apiRequest;
