import axios from 'axios';

// You can adjust the base URL depending on your environment
const BASE_URL = 'http://localhost:8000/api/v1/employee'; // Example, change to your backend

/**
 * Add Educator Service
 * @param {Object} educatorData - Data from your form
 * @returns {Promise<Object>} - The response from the server
 */
export const addEducator = async (educatorData) => {
  try {
    // You might need multipart/form-data if you're sending an avatar (file)
    const formData = new FormData();

    // Append regular fields
    formData.append('employeeId', educatorData.employeeId);
    formData.append('name', educatorData.name);
    formData.append('gender', educatorData.gender);
    formData.append('email', educatorData.email);
    formData.append('password', educatorData.password);
    formData.append('designation', educatorData.designation || 'Educator');
    formData.append('department', educatorData.department || 'Special Education');
    formData.append('employmentType', educatorData.employmentType);
    formData.append('program', educatorData.program);
    formData.append('phone', educatorData.phone);
    formData.append('DOB', educatorData.DOB);
    formData.append('dateOfJoining', educatorData.dateOfJoining);
    formData.append('dateOfLeaving', educatorData.dateOfLeaving || '');
    formData.append('status', educatorData.status || 'Active');
    formData.append('workLocation', educatorData.workLocation);
    formData.append('bloodGroup', educatorData.bloodGroup);

    // Emergency Contact (Nested object)
    formData.append('emergencyContact[name]', educatorData.emergencyContact.name);
    formData.append('emergencyContact[contact]', educatorData.emergencyContact.contact);

    // Append avatar file if present
    if (educatorData.avatar) {
      formData.append('avatar', educatorData.avatar);
    }

    const response = await axios.post(`${BASE_URL}/employees/addEducator`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error adding educator:', error);
    throw error?.response?.data || { message: 'Something went wrong!' };
  }
};

/**
 * Fetch All Employees Service
 * @returns {Promise<Array>} - Array of all employees
 */
export const getAllEmployees = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetch-all-employees`);
    return response.data;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error?.response?.data || { message: 'Failed to fetch employees' };
  }
};
