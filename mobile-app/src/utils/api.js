import axios from "axios";
import * as SecureStore from "expo-secure-store";

const api = axios.create({
  baseURL: "http://172.20.10.2:8000/api/v1/student",
  headers: { "Content-Type": "application/json" },
});

// **Handle Login Function**
export const handleLogin = async (studentEmail, password) => {
  try {
    console.log("Attempting login with:", { studentEmail, password }); // Debug log
    
    const response = await api.post("/login", {
      studentEmail: studentEmail,
      password: password
    });
    
    console.log("Server response:", response.data); // Debug log
    
    if (response.data?.data?.tokens) {
      // Securely store tokens
      await SecureStore.setItemAsync("accessToken", response.data.data.tokens.accessToken);
      await SecureStore.setItemAsync("refreshToken", response.data.data.tokens.refreshToken);
      return { success: true };
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

export default api;
