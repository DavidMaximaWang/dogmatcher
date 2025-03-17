import axios from 'axios';

const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;