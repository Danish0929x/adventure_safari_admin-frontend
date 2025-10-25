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
// const API_BASE_URL = 'https://adventure-safari-admin-backend2.onrender.com/api';
const API_BASE_URL = 'http://localhost:5000/api';

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
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips`);
  },

  // Get single trip
  getTripById: async (id) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${id}`);
  },

  // Create new trip
  createTrip: async (tripData) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips`, {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  },

  // Update trip
  updateTrip: async (id, tripData) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tripData)
    });
  },

  // Delete trip
  deleteTrip: async (id) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${id}`, {
      method: 'DELETE'
    });
  },

  // Toggle trip status
  toggleTripStatus: async (id) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/trips/${id}/toggle-status`, {
      method: 'PATCH'
    });
  },

  // Create new booking
  createBooking: async (bookingData) => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/admin/create-booking`, {
      method: 'POST',
      body: JSON.stringify(bookingData)
    });
  },
};

// Individual exported functions
export const getAllUsers = () => adminService.getAllUsers();
export const getAllBookings = () => adminService.getAllBookings();
export const getAllTrips = () => adminService.getAllTrips();
export const getTripById = (id) => adminService.getTripById(id);
export const createTrip = (tripData) => adminService.createTrip(tripData);
export const updateTrip = (id, tripData) => adminService.updateTrip(id, tripData);
export const deleteTrip = (id) => adminService.deleteTrip(id);
export const toggleTripStatus = (id) => adminService.toggleTripStatus(id);
export const createBooking = (bookingData) => adminService.createBooking(bookingData);

export default adminService;