import axios from "axios";

// const URL = import.meta.env.VITE_SERVER_URL_LOCAL;
const URL = import.meta.env.VITE_SERVER_URL_DEPLOYMENT;

const apiRequest = axios.create({
  baseURL: URL,
  // withCredentials: true,
  withCredentials: false,
});

apiRequest.interceptors.request.use(
  (config) => {
    // Check if the request requires authentication (e.g., checking for a 'auth' flag)
    if (config.headers.requiresAuth !== false) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.token) {
        config.headers["Authorization"] = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiRequest;
