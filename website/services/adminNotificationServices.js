import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/admin-notification';

// Helper function to get auth token
const getAuthToken = () => {
    const token = localStorage.getItem('token');
    console.log('Auth token:', token); // Debug log
    return token;
};

// Helper function to get auth headers
const getHeaders = () => {
    const token = getAuthToken();
    const headers = {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
    console.log('Request headers:', headers); // Debug log
    return headers;
};

/**
 * Get all pending notifications
 * @returns {Promise<Object>} Response containing pending notifications
 */
export const getPendingNotifications = async () => {
    try {
        console.log('Fetching notifications from:', `${BASE_URL}/pending`); // Debug log
        const response = await axios.get(`${BASE_URL}/pending`, getHeaders());
        console.log('Notifications response:', response.data); // Debug log
        return response.data;
    } catch (error) {
        console.error('Error fetching pending notifications:', error.response || error);
        throw error?.response?.data || { message: 'Failed to fetch pending notifications' };
    }
};

/**
 * Approve a registration request
 * @param {string} notificationId - The ID of the notification to approve
 * @returns {Promise<Object>} Response containing the updated notification
 */
export const approveRegistration = async (notificationId) => {
    try {
        const response = await axios.put(`${BASE_URL}/approve/${notificationId}`, {}, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Error approving registration:', error);
        throw error?.response?.data || { message: 'Failed to approve registration' };
    }
};

/**
 * Reject a registration request
 * @param {string} notificationId - The ID of the notification to reject
 * @param {string} reason - The reason for rejection
 * @returns {Promise<Object>} Response containing the updated notification
 */
export const rejectRegistration = async (notificationId, reason) => {
    try {
        const response = await axios.put(`${BASE_URL}/reject/${notificationId}`, { reason }, getHeaders());
        return response.data;
    } catch (error) {
        console.error('Error rejecting registration:', error);
        throw error?.response?.data || { message: 'Failed to reject registration' };
    }
}; 