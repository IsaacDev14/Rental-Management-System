// frontend/src/utils/constants.ts

/**
 * Defines the base URL for the backend API.
 * This should point to where your backend server is running.
 * For local development, it's typically http://localhost:5000 or similar.
 * In a production environment, this would be your deployed API endpoint.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// You can add other global constants here if needed
export const APP_NAME = "RentalFlow";
export const KRA_TAX_RATE = 0.10; // Example KRA tax rate (10%)
