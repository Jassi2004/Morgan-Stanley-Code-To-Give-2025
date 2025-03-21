import axios from 'axios';

// You can adjust the base URL depending on your environment
const BASE_URL = 'http://localhost:8000/api/v1/student'; // Example, change to your backend


/**
 * Fetch All Students Service
 * @returns {Promise<Object>} - Response containing students data
 */
export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchAllStudents`);
    // Log the response to check its structure
    console.log("API Response in service:", response);
    return response;
  } catch (error) {
    console.error('Error fetching students:', error);
    // Return a consistent structure even in case of error
    throw error?.response?.data || { 
      success: false,
      message: 'Failed to fetch students',
      data: []
    };
  }
};

// Add other student-related services here as needed
