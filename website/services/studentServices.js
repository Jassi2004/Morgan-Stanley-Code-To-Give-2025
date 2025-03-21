import axios from 'axios';

// You can adjust the base URL depending on your environment
const BASE_URL = 'http://localhost:8000/api/v1/student'; // Example, change to your backend


/**
 * Fetch All Employees Service
 * @returns {Promise<Array>} - Array of all employees
 */
export const getAllStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-all-employees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error?.response?.data || { message: 'Failed to fetch employees' };
  }
};
