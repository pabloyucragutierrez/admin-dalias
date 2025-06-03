import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3012/api/",
  // baseURL: "https://automotiv-back-production.up.railway.app/api/",
});

export default api;
