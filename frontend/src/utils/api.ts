// frontend/src/utils/api.ts

import axios from 'axios';
import { API_BASE_URL } from './constants'; // Import the base URL from constants

/**
 * Configures an Axios instance for making API requests to the backend.
 * This centralizes API calls, allowing for easier management of base URLs,
 * headers (like authorization tokens), and error handling.
 */
const api = axios.create({
  baseURL: API_BASE_URL, // Use the base URL defined in constants
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor for adding authorization tokens to requests.
 * In a real application, you would fetch the token from localStorage or a state management solution.
 */
api.interceptors.request.use(
  (config) => {
    // Example: Get token from localStorage (replace with actual auth logic)
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Interceptor for handling API response errors.
 * Can be used to log errors, show user notifications, or redirect on certain status codes.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);

      // Example: Handle 401 Unauthorized globally
      if (error.response.status === 401) {
        // Optionally, redirect to login page or refresh token
        console.warn('Unauthorized access. Please log in again.');
        // window.location.href = '/login'; // Example redirect
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error Request:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error Message:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
