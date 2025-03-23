import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/adminnotification';

export const getAllAdminNotifications = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/pending`);
        return response.data.data.notifications; // Adjust based on your API response structure
    } catch (error) {
        console.error('Error fetching notifications:', error);
        throw error?.response?.data || error.message;
    }
};

export const approveRegistration = async (notificationId) => {
    try {
        const response = await axios.put(`${BASE_URL}/approve/${notificationId}`);
        return response.data;
    } catch (error) {
        throw error?.response?.data || error.message;
    }
};

export const rejectRegistration = async (notificationId, reason) => {
    try {
        console.log('Sending rejection request:', { notificationId, reason }); // Debug log
        
        const response = await axios.put(`${BASE_URL}/reject/${notificationId}`, {
            reason: reason
        });
        
        console.log('Rejection response:', response.data); // Debug log
        
        return response.data;
    } catch (error) {
        console.error('Rejection service error:', error.response || error);
        throw error?.response?.data || { message: 'Failed to reject registration' };
    }
};

export const getEntityDetails = async (id, type) => {
    try {
        const response = await axios.get(`${BASE_URL}/details`, {
            params: { id, type }
        });
        // Return the entityDetails directly since that's what the backend sends
        return response.data.data.entityDetails;
    } catch (error) {
        console.error('Error in getEntityDetails:', error.response || error);
        throw error?.response?.data || error.message;
    }
};