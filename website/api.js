import axios from "axios";

const BASE_URL = "http://localhost:8000/api/v1";

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 403) {
            // Handle token expiration
            localStorage.removeItem('accessToken');
            // Redirect to login or refresh token
        }
        return Promise.reject(error);
    }
);

export default api;