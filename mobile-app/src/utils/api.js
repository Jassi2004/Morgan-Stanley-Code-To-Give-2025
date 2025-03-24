import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://172.20.10.2:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get educator details
const getEducatorDetails = async (educatorId) => {
  try {
    console.log("Attempting to fetch details for educator ID:", educatorId);
    
    // First try to get from fetch-all-employees and filter
    const response = await api.get('/employee/fetch-all-employees');
    if (response.data?.data) {
      const allEmployees = response.data.data;
      
      const educator = allEmployees.find(emp => emp._id.toString() === educatorId.toString());
      console.log("Found educator:", educator ? {
        id: educator._id,
        name: educator.name,
        designation: educator.designation,
        department: educator.department,
        email: educator.email,
        phone: educator.phone,
        avatar: educator.avatar
      } : 'Not found');
      
      if (educator) {
        return {
          name: educator.name,
          specialty: educator.designation,
          email: educator.email,
          phone: educator.phone,
          department: educator.department,
          _id: educator._id,
          avatar: educator.avatar || {
            public_id: null,
            secure_url: null
          }
        };
      }
    }
    return null;
  } catch (error) {
    console.error(`Error fetching educator details for ${educatorId}:`, error);
    return null;
  }
};

// **Handle Login Function**
export const handleLogin = async (studentEmail, password) => {
  try {
    console.log("Attempting login with:", { studentEmail, password });
    
    const response = await api.post("/student/login", {
      studentEmail: studentEmail,
      password: password
    });
    
    if (response.data?.data) {
      const { tokens, student } = response.data.data;
      
      // Fetch educator details if student has educators assigned
      if (student.educator && student.educator.length > 0) {
        try {
          const [primaryEducator, secondaryEducator] = await Promise.all([
            student.educator[0] ? getEducatorDetails(student.educator[0]) : null,
            student.educator[1] ? getEducatorDetails(student.educator[1]) : null
          ]);

          // Add educator details to student data
          student.educatorDetails = {
            primary: primaryEducator || {
              name: 'Not Assigned',
              specialty: 'Special Education Specialist',
              email: '',
              phone: '',
              department: ''
            },
            secondary: secondaryEducator || {
              name: 'Not Assigned',
              specialty: 'Behavioral Therapist',
              email: '',
              phone: '',
              department: ''
            }
          };

          console.log("Added educator details:", student.educatorDetails);
        } catch (error) {
          console.error("Error fetching educator details:", error);
          // Set default values if educator fetch fails
          student.educatorDetails = {
            primary: {
              name: 'Not Assigned',
              specialty: 'Special Education Specialist',
              email: '',
              phone: '',
              department: ''
            },
            secondary: {
              name: 'Not Assigned',
              specialty: 'Behavioral Therapist',
              email: '',
              phone: '',
              department: ''
            }
          };
        }
      } else {
        // Set default values if no educators assigned
        student.educatorDetails = {
          primary: {
            name: 'Not Assigned',
            specialty: 'Special Education Specialist',
            email: '',
            phone: '',
            department: ''
          },
          secondary: {
            name: 'Not Assigned',
            specialty: 'Behavioral Therapist',
            email: '',
            phone: '',
            department: ''
          }
        };
      }
      
      // Store tokens
      await SecureStore.setItemAsync("accessToken", tokens.accessToken);
      await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
      
      // Store user data with educator details
      await SecureStore.setItemAsync("userData", JSON.stringify(student));
      
      return { 
        success: true,
        userData: student
      };
    }
    return { 
      success: false, 
      message: response.data?.message || "Login failed" 
    };
  } catch (error) {
    console.error("Login Error Details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return { 
      success: false, 
      message: error.response?.data?.message || "Invalid email or password"
    };
  }
};

// Get stored user data
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync("userData");
    // console.log("Retrieved stored user data:", userData); // Debug log
    
    if (!userData) {
      console.log("No user data found in storage");
      return null;
    }
    
    const parsedData = JSON.parse(userData);
    console.log("Parsed user data:", parsedData); // Debug log
    return parsedData;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

// Handle Logout Function
export const handleLogout = async () => {
  try {
    // Clear all stored data
    await SecureStore.deleteItemAsync("accessToken");
    await SecureStore.deleteItemAsync("refreshToken");
    await SecureStore.deleteItemAsync("userData");
    
    console.log("Successfully cleared all user data and tokens");
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: error.message };
  }
};

// Get Notifications
export const getNotifications = async () => {
  try {
    const response = await api.get("/notification/getnotification");
    console.log("Notifications response:", response.data);
    
    if (response.data?.success) {
      return {
        success: true,
        notifications: response.data.data.notifications || []
      };
    }
    
    return {
      success: false,
      notifications: [],
      message: response.data?.message || "Failed to fetch notifications"
    };
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return {
      success: false,
      notifications: [],
      message: error.response?.data?.message || "Error fetching notifications"
    };
  }
};

// Feedback APIs
export const sendFeedbackToEducator = async (studentId, educatorId, content, rating) => {
  try {
      console.log('Sending feedback with data:', { studentId, educatorId, content, rating });
      const response = await api.post(`/feedback/sendFeedback`, {
          studentId,
          educatorId,
          content,
          rating
      });
      console.log('Feedback send response:', response.data);
      return response.data;
  } catch (error) {
      console.error('Error sending feedback:', error.response?.data || error.message);
      throw error;
  }
};

export const getReceivedFeedbacks = async (educatorId, studentId) => {
  try {
    if (!educatorId || !studentId) {
      throw new Error("Educator ID and Student ID are required");
    }

    console.log(
      "Fetching received feedbacks for educator:",
      educatorId,
      "from student:",
      studentId
    );

    const response = await api.get(
      `/feedback/getReceivedFeedbacks/${educatorId}/${studentId}`
    );

    console.log("Received feedbacks from backend:", response.data); // Log the feedback data

    if (response.status === 404) {
      return {
        success: true,
        data: [],
        message: "No feedback found",
      };
    }

    return {
      success: true,
      data: response.data?.data || [],
      message: response.data?.message || "Feedbacks retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching feedbacks:", error); // Log the error for debugging

    return {
      success: false,
      data: [],
      message: error.response?.data?.message || "Failed to retrieve feedbacks",
      error: error.message,
    };
  }
};

// Handle Student Registration
export const handleSignup = async (formData) => {
  try {
    console.log("Attempting signup with data:", formData);
    
    // Format the data according to the backend schema
    const signupData = {
      StudentId: `STU${Date.now()}`, // Generate a unique student ID
      firstName: formData.firstName,
      lastName: formData.lastName,
      studentEmail: formData.studentEmail,
      password: formData.password,
      gender: formData.gender,
      dateOfBirth: formData.dateOfBirth,
      primaryDiagnosis: formData.primaryDiagnosis,
      enrollmentYear: new Date(),
      address: formData.address,
      guardianDetails: {
        name: formData.guardianDetails,
        relation: "Parent/Guardian",
        contactNumber: formData.guardianContact,
        parentEmail: formData.parentEmail
      },
      transport: formData.transportRequired,
      allergies: formData.allergies ? [formData.allergies] : [],
      medicalHistory: {
        notes: formData.medicalHistory
      },
      deviceAccess: [formData.deviceAccess],
      preferredLanguage: "English"
    };

    const response = await api.post("/student/register", signupData);
    
    if (response.data?.data) {
      return { 
        success: true,
        data: response.data.data
      };
    }
    
    return { 
      success: false, 
      message: response.data?.message || "Registration failed" 
    };
  } catch (error) {
    console.error("Signup Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return { 
      success: false, 
      message: error.response?.data?.message || "Failed to register student"
    };
  }
};

export default api;
