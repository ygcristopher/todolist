import axios from "axios";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
}

const api = axios.create({
  baseURL: "http://localhost:3003",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if(config.url === "/create-user" || config.url === "/login-user") {
      return config;
    }

    if (!token) {
      window.location.assign("/");
      return Promise.reject(new Error("No token provided"));
    }

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token");
        window.location.assign("/");
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      localStorage.removeItem("token");
      window.location.assign("/");
      return Promise.reject(new Error("Invalid token"));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
