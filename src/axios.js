import axios from 'axios';

// Crea un'istanza Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost/api', // Base URL della tua API
});

// Aggiungi un intercettore per includere il token in ogni richiesta
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Recupera il token dal localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Aggiunge il token nell'header Authorization
  }
  return config;
}, (error) => {
  return Promise.reject(error); // Gestione errori
});

// Esporta l'istanza Axios configurata
export default axiosInstance;
