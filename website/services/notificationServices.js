import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/v1/notification';

/** 
 * Publish a new notification
 * @param {Object} notificationData - The notification data to publish
 * @returns {Promise<Object>} - Response containing the created notification
 */
export const publishNotification = async (notificationData) => {
  try {
    const response = await axios.post(`${BASE_URL}/sendnotification`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error publishing notification:', error);
    throw error?.response?.data || { message: 'Failed to publish notification' };
  }
};

/**
 * Fetch all notifications
 * @returns {Promise<Object>} - Response containing all notifications
 */
export const getAllNotifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/getnotification`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error?.response?.data || { message: 'Failed to fetch notifications' };
  }
};
