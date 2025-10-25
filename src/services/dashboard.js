// services/dashboard.js

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

// Dashboard service functions
export const dashboardService = {
  // Get all dashboard statistics (includes cardData, userGrowthData, weeklyBookingsData)
  getDashboardStats: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/dashboard/stats`);
  },

  // Get user growth data only
  getUserGrowthData: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/dashboard/user-growth`);
  },

  // Get weekly bookings data only
  getWeeklyBookingsData: async () => {
    return await makeAuthenticatedRequest(`${API_BASE_URL}/dashboard/weekly-bookings`);
  }
};

// Individual exported functions
export const getDashboardStats = () => dashboardService.getDashboardStats();
export const getUserGrowthData = () => dashboardService.getUserGrowthData();
export const getWeeklyBookingsData = () => dashboardService.getWeeklyBookingsData();

export default dashboardService;
