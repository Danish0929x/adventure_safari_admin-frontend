// authService.js
import axios from 'axios';

// const API_BASE_URL = 'https://adventure-safari-admin-backend2.onrender.com/api';
const API_BASE_URL = 'http://localhost:5000/api';


export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: credentials.email,
      password: credentials.password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up login request');
    }
  }
};































