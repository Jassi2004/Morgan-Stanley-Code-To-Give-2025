import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/adminnotification';

/**
 * Fetch all admin notifications
 * @returns {Promise<Object>} - Response containing all admin notifications
 */
export const getAllAdminNotifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/pending`);
    return response.data;
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    throw error?.response?.data || { message: 'Failed to fetch admin notifications' };
  }
};

/**
 * Approve a specific notification
 * @param {string} notificationId - ID of the notification to approve
 * @returns {Promise<Object>} - Response containing the updated notification
 */
export const approveRegistration = async (notificationId) => {
  try {
    const response = await axios.put(`${BASE_URL}/approve/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error approving notification:', error);
    throw error?.response?.data || { message: 'Failed to approve notification' };
  }
};

/**
 * Reject a specific notification
 * @param {string} notificationId - ID of the notification to reject
 * @param {string} reason - Reason for rejection (optional)
 * @returns {Promise<Object>} - Response containing the updated notification
 */
export const rejectRegistration = async (notificationId, reason = '') => {
  try {
    const response = await axios.put(`${BASE_URL}/reject/${notificationId}`, { reason });
    return response.data;
  } catch (error) {
    console.error('Error rejecting notification:', error);
    throw error?.response?.data || { message: 'Failed to reject notification' };
  }
};