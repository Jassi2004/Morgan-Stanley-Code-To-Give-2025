import axios from "axios";
//import * as AuthSession from 'expo-auth-session';
const API_BASE_URL = "http://172.20.10.2:5000/api"; 
const GOOGLE_CLIENT_ID ="54439666276-7iem1mtjhl8k8otnikd1ecnjomvoprtu.apps.googleusercontent.com";

export const handleGoogleLoginBackend = async (idToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/google`, { token: idToken });
    return response.data;
  } catch (error) {
    console.error("Google Login Error:", error);
    throw error.response?.data || "An error occurred";
  }
};

export const handleGoogleLogin = async () => {
  const result = await promptAsync();
  if (result.type === 'success') {
    const { id_token } = result.params;

    // Send token to backend for verification and login
    const response = await axios.post("http://YOUR_BACKEND_URL/api/auth/google", { token: id_token });

    if (response.data.success) {
      console.log("User logged in successfully:", response.data);
      navigation.navigate("Home");
    } else {
      setErrorMessage("Google login failed");
    }
  }
};


export const signUpUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || "An error occurred";
  }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "An error occurred";
    }
    }

    // export const handleGoogleLogin = async (navigation) => { // Accept navigation
    //   try {
    //     const redirectUri = AuthSession.makeRedirectUri();
    //     const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&response_type=token&redirect_uri=${redirectUri}&scope=email%20profile`;
    
    //     const result = await AuthSession.startAuthSessionAsync({ authUrl });
    
    //     if (result.type === "success") {
    //       const { access_token } = result.params;
    //       console.log("Google Access Token:", access_token);
    
    //       // Send token to backend for verification and login
    //       const response = await axios.post("http://API_BASE_URL/api/auth/google", { token: access_token });
    
    //       if (response.data.success) {
    //         console.log("User logged in successfully:", response.data);
    //         navigation.navigate("Home");  // Navigate to home screen on success
    //       } else {
    //         console.error("Google login failed");
    //       }
    //     }
    //   } catch (error) {
    //     console.error("Google Login Error:", error);
    //   }
    // };
    