import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getAllAdminNotifications, approveRegistration, rejectRegistration } from '../../services/adminNotificationServices';

const AdminNotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedNotification, setSelectedNotification] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await getAllAdminNotifications();
            const notificationData =
                Array.isArray(response) ? response :
                Array.isArray(response.data) ? response.data :
                response.data?.notifications || [];
            setNotifications(notificationData);
        } catch (error) {
            console.error('Notification fetch error:', error);
            toast.error(error?.message || 'Failed to fetch notifications');
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (notificationId) => {
        try {
            await approveRegistration(notificationId);
            toast.success('Registration approved successfully');
            fetchNotifications();
        } catch (error) {
            console.error('Approval error:', error);
            toast.error(error?.message || 'Failed to approve registration');
        }
    };

    const handleReject = async (notificationId) => {
        if (!rejectReason.trim()) {
            toast.warning('Rejection reason is required');
            return;
        }

        try {
            await rejectRegistration(notificationId, rejectReason);
            toast.success('Registration rejected successfully');
            setSelectedNotification(null);
            setRejectReason('');
            fetchNotifications();
        } catch (error) {
            console.error('Rejection error:', error);
            toast.error(error?.message || 'Failed to reject registration');
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'STUDENT_REGISTRATION':
                return <AlertCircle className="w-5 h-5 text-[var(--color-info)]" />;
            case 'EMPLOYEE_REGISTRATION':
                return <AlertCircle className="w-5 h-5 text-[var(--color-brand)]" />;
            default:
                return <AlertCircle className="w-5 h-5 text-[var(--color-text-secondary)]" />;
        }
    };

    if (loading) {
        return (
            <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6">
                <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-[var(--color-bg-accent)] rounded w-3/4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-[var(--color-bg-accent)] rounded"></div>
                            <div className="h-4 bg-[var(--color-bg-accent)] rounded w-5/6"></div>
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
                            className="flex items-start space-x-3 p-4 rounded-lg hover:bg-[var(--color-bg-accent)] border border-[var(--color-border-primary)]"
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
                                            className="px-3 py-1 rounded-lg bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] transition-all"
                                            title="Approve"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => setSelectedNotification(notification)}
                                            className="px-3 py-1 rounded-lg bg-[var(--color-danger)] text-white hover:bg-red-600 transition-all"
                                            title="Reject"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm mt-2">{notification.message}</p>

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
                                                className="px-3 py-1 text-sm rounded-lg bg-[var(--color-bg-accent)] hover:bg-[var(--color-bg-primary)]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleReject(notification._id)}
                                                className="px-3 py-1 text-sm rounded-lg bg-[var(--color-danger)] text-white hover:bg-red-600"
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