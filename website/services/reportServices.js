import axios from 'axios';

// You can adjust the base URL depending on your environment
const BASE_URL = 'http://localhost:8000/api/v1/student-report'; // Example, change to your backend

// Add request interceptor for common headers
axios.interceptors.request.use(
  (config) => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for common error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      success: false,
      message: error?.response?.data?.message || 'Something went wrong',
      data: null
    };
    return Promise.reject(customError);
  }
);

/**
 * Fetch All Students Service
 * @returns {Promise<Object>} - Response containing students data
 */
const getAllReports = async () => {
    
    
  try {
    const response = await axios.get(`${BASE_URL}/fetch-all`);
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Students fetched successfully',
        data: response.data.data || []
      };
    } else {
      throw new Error(response.data?.message || 'Failed to fetch students');
    }
  } catch (error) {
    console.error('Error fetching students:', error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch students',
      data: []
    };
  }
}; 


export {
    getAllReports,
  };
  
