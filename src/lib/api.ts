import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3012/api/",
});

export default api;
