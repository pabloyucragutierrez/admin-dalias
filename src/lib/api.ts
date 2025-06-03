import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:3012/api/",
  baseURL: "https://back.automotivdelperu.com/api/",
});

export default api;
