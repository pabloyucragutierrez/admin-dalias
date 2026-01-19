import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  //baseURL: "https://backend-dalias.onrender.com",
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const storage = localStorage.getItem("dalias-auth-storage");
    
    if (storage) {
      try {
        const parsedStorage = JSON.parse(storage);
        const token = parsedStorage?.state?.token;
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error al parsear el storage:", error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token expiró o es inválido (401), redirigir al login
    if (error.response?.status === 401) {
      localStorage.removeItem("dalias-auth-storage");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;