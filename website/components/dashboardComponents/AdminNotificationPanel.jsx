import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getPendingNotifications, approveRegistration, rejectRegistration } from '../../services/adminNotificationServices';

const AdminNotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await getPendingNotifications();
            console.log('Raw API response:', response); // Debug log
            // Check if response is an array directly or nested in data property
            const notificationData = Array.isArray(response) ? response : 
                                   Array.isArray(response.data) ? response.data :
                                   response.data?.notifications || [];
            console.log('Processed notifications:', notificationData); // Debug log
            setNotifications(notificationData);
        } catch (error) {
            console.error('Notification fetch error:', error);
            toast.error(error.message || 'Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (notificationId) => {
        try {
            await approveRegistration(notificationId);
            toast.success('Registration approved successfully');
            fetchNotifications(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'Failed to approve registration');
        }
    };

    const handleReject = async (notificationId) => {
        try {
            await rejectRegistration(notificationId, rejectReason);
            toast.success('Registration rejected successfully');
            setSelectedNotification(null);
            setRejectReason('');
            fetchNotifications(); // Refresh the list
        } catch (error) {
            toast.error(error.message || 'Failed to reject registration');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'STUDENT_REGISTRATION':
                return <AlertCircle className="w-5 h-5 text-blue-500" />;
            case 'EMPLOYEE_REGISTRATION':
                return <AlertCircle className="w-5 h-5 text-purple-500" />;
            default:
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-[var(--color-bg-hover)] rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-[var(--color-bg-hover)] rounded"></div>
                            <div className="h-4 bg-[var(--color-bg-hover)] rounded w-5/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
            <h3 className="text-lg font-semibold mb-4">Registration Requests</h3>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className="flex items-start space-x-3 p-4 rounded-lg transition-colors duration-300 hover:bg-[var(--color-bg-hover)] border border-[var(--color-border-primary)]"
                        >
                            <div className="flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-medium">
                                            {notification.type === 'STUDENT_REGISTRATION' ? 'Student' : 'Employee'} Registration Request
                                        </p>
                                        <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleApprove(notification._id)}
                                            className="p-1 rounded-full hover:bg-green-100 dark:hover:bg-green-900 transition-colors duration-200"
                                            title="Approve"
                                        >
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedNotification(notification)}
                                            className="p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                                            title="Reject"
                                        >
                                            <XCircle className="w-5 h-5 text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm mt-2">
                                    {notification.message}
                                </p>

                                {selectedNotification?._id === notification._id && (
                                    <div className="mt-3 space-y-2">
                                        <textarea
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            placeholder="Enter reason for rejection..."
                                            className="w-full p-2 text-sm rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                                            rows="2"
                                        />
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedNotification(null);
                                                    setRejectReason('');
                                                }}
                                                className="px-3 py-1 text-sm rounded-lg hover:bg-[var(--color-bg-hover)]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleReject(notification._id)}
                                                className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600"
                                                disabled={!rejectReason.trim()}
                                            >
                                                Confirm Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-[var(--color-text-secondary)] py-4">
                        No pending registration requests
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminNotificationPanel; 