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

// **Handle Login Function**
export const handleLogin = async (studentEmail, password) => {
  try {
    console.log("Attempting login with:", { studentEmail, password }); // Debug log
    
    const response = await api.post("/student/login", {
      studentEmail: studentEmail,
      password: password
    });
    
    console.log("Server response:", response.data); // Debug log
    
    if (response.data?.data) {
      const { tokens, student } = response.data.data;
      
      console.log("Student data to be stored:", student); // Debug log
      
      // Store tokens
      await SecureStore.setItemAsync("accessToken", tokens.accessToken);
      await SecureStore.setItemAsync("refreshToken", tokens.refreshToken);
      
      // Store user data
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
    console.log("Retrieved stored user data:", userData); // Debug log
    
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

export default api;
