import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // ou IP da sua VPS
});

export default api;
