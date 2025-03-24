import axios from 'axios';

// You can adjust the base URL depending on your environment
const BASE_URL = 'http://localhost:8000/api/v1/student'; // Example, change to your backend

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
const getAllStudents = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/fetchAllStudents`);
    if (response.data?.success) {
      return {
        success: true,
        message: response.data.message || 'Students fetched successfully',
        data: response.data.data?.students || []
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

/**
 * Update Student Profile Service
 * @param {string} studentId - The ID of the student to update
 * @param {Object} updateData - The data to update
 * @param {Object} files - Optional files to upload (avatar, UDID)
 * @returns {Promise<Object>} - Response containing updated student data
 */
const updateStudent = async (studentId, updateData, files = null) => {
  try {
    let formData;
    let config = {};
    console.log("upload-data : ", updateData );

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
      
      // Handle nested objects and arrays properly
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            // Handle arrays
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects
            formData.append(key, JSON.stringify(value));
          } else {
            // Handle primitive values
            formData.append(key, value);
          }
        }
      });

      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const response = await axios.put(
      `${BASE_URL}/update-profile`,
      files ? formData : { studentId, ...updateData },
      config
    );

    console.log('Update response:', response.data);  // Add this for debugging

    return {
      success: true,
      message: 'Profile updated successfully',
      data: response.data.data
    };

  } catch (error) {
    console.error('Error updating student:', error.response || error);  // Enhanced error logging
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to update student profile',
      data: null
    };
  }
};

/**
 * Get Student Profile Service
 * @param {string} studentId - The ID of the student
 * @returns {Promise<Object>} - Response containing student profile data
 */
const getStudentProfile = async (studentId) => {
  try {
    let response;
    if (studentId) {
      // Admin viewing a specific student
      response = await axios.get(`${BASE_URL}/profile/${studentId}`);
    } else {
      // Student viewing their own profile
      response = await axios.get(`${BASE_URL}/profile`);
    }
    
    return {
      success: true,
      message: 'Profile fetched successfully',
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw {
      success: false,
      message: error.response?.data?.message || error.message || 'Failed to fetch student profile',
      data: null
    };
  }
};
export {
  updateStudent,
  getStudentProfile,
  getAllStudents
};
