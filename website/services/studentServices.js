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

/**
 * Update Student Profile Service
 * @param {string} studentId - The ID of the student to update
 * @param {Object} updateData - The data to update
 * @param {Object} files - Optional files to upload (avatar, UDID)
 * @returns {Promise<Object>} - Response containing updated student data
 */
export const updateStudent = async (studentId, updateData, files = null) => {
  try {
    let formData;
    
    // If files are provided, use FormData
    if (files) {
      formData = new FormData();
      
      // Append files if they exist
      if (files.avatar) {
        formData.append('avatar', files.avatar);
      }
      if (files.UDID) {
        formData.append('UDID', files.UDID);
      }
      
      // Append other data
      formData.append('studentId', studentId);
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          // Handle nested objects (like guardianDetails or medicalHistory)
          if (typeof updateData[key] === 'object' && updateData[key] !== null) {
            formData.append(key, JSON.stringify(updateData[key]));
          } else {
            formData.append(key, updateData[key]);
          }
        }
      });

      // Set headers for multipart/form-data
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await axios.put(`${BASE_URL}/updateProfile`, formData, config);
      return response.data;
    } else {
      // If no files, send regular JSON
      const response = await axios.put(`${BASE_URL}/updateProfile`, {
        studentId,
        ...updateData
      });
      return response.data;
    }
  } catch (error) {
    console.error('Error updating student:', error);
    throw error?.response?.data || {
      success: false,
      message: error.message || 'Failed to update student profile',
    };
  }
};

/**
 * Get Student Profile Service
 * @param {string} studentId - The ID of the student
 * @returns {Promise<Object>} - Response containing student profile data
 */
export const getStudentProfile = async (studentId) => {
  try {
    const response = await axios.post(`${BASE_URL}/profile`, { studentId });
    return response.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error?.response?.data || {
      success: false,
      message: 'Failed to fetch student profile',
    };
  }
};

// Example usage of updateStudent:
/*
// Without files:
updateStudent('STU123', {
  firstName: 'John',
  lastName: 'Doe',
  gender: 'Male',
  address: '123 Main St',
  primaryDiagnosis: 'ADHD',
  guardianDetails: {
    name: 'Jane Doe',
    relation: 'Mother',
    contactNumber: '9876543210',
    parentEmail: 'jane@example.com'
  }
});

// With files:
const files = {
  avatar: avatarFile, // File object from input
  UDID: udidFile     // File object from input
};
updateStudent('STU123', {
  firstName: 'John',
  deviceAccess: ['Tablet', 'Laptop']
}, files);
*/

// Add other student-related services here as needed
