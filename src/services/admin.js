// services/admin.js

// Common authenticated request function
const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      ...options
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API base URL (adjust according to your backend URL)
const API_BASE_URL = 'https://adventure-safari-admin-backend2.onrender.com/api';

// Admin service functions
export const adminService = {
  // Get all users
  getAllUsers: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/admin/all-users`);
  },

  // Get all bookings
  getAllBookings: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/admin/get-all-bookings`);
  },

  // Get all trips
  getAllTrips: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/admin/get-all-trips`);
  },

  // Create new booking
  createBooking: async (bookingData) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/admin/create-booking`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },

  // Additional admin functions can be added here
  // Example: updateBookingStatus, deleteUser, etc.
};

// Individual exported functions
export const getAllUsers = () => adminService.getAllUsers();
export const getAllBookings = () => adminService.getAllBookings();
export const getAllTrips = () => adminService.getAllTrips();
export const createBooking = (bookingData) => adminService.createBooking(bookingData);

export default adminService;