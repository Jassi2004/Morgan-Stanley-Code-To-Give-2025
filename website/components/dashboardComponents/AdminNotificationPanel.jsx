import React, { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import { Eye, X } from 'lucide-react';
import { 
    getAllAdminNotifications, 
    approveRegistration, 
    rejectRegistration,
    getEntityDetails 
} from '../../services/adminNotificationServices';

const AdminNotificationPanel = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [detailsData, setDetailsData] = useState(null);
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const data = await getAllAdminNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (notification) => {
        try {
            const type = notification.type === 'STUDENT_REGISTRATION' ? 'student' : 'employee';
            const id = type === 'student' ? notification.studentId : notification.employeId;
            
            console.log('Fetching details for:', { type, id });
            
            const details = await getEntityDetails(id, type);
            console.log('Received details:', details);
            
            if (!details) {
                throw new Error('No details received from server');
            }
            
            setDetailsData(details);
            setSelectedNotification(notification);
            setShowDetailsModal(true);
        } catch (error) {
            console.error('Error fetching details:', error);
            toast.error(error.message || 'Failed to fetch details');
        }
    };

    const handleApprove = async (notificationId) => {
        try {
            await approveRegistration(notificationId);
            toast.success('Registration approved successfully');
            fetchNotifications();
            setShowDetailsModal(false);
            setSelectedNotification(null);
            setDetailsData(null);
        } catch (error) {
            toast.error(error?.message || 'Failed to approve registration');
        }
    };

    const handleReject = async (notificationId) => {
        if (!rejectReason.trim()) {
            toast.warning('Please provide a reason for rejection');
            return;
        }

        try {
            console.log('Rejecting notification:', { notificationId, reason: rejectReason }); // Debug log
            
            const response = await rejectRegistration(notificationId, rejectReason);
            
            if (response.success) {
                toast.success('Registration rejected successfully');
                await fetchNotifications(); // Refresh the notifications list
                setShowDetailsModal(false);
                setShowRejectModal(false);
                setSelectedNotification(null);
                setDetailsData(null);
                setRejectReason('');
            } else {
                throw new Error(response.message || 'Failed to reject registration');
            }
        } catch (error) {
            console.error('Rejection error:', error);
            toast.error(error.message || 'Failed to reject registration');
        }
    };

    const renderDetailsView = () => {
        if (!detailsData) {
            return (
                <div className="p-6 text-center text-[var(--color-text-secondary)]">
                    No details available
                </div>
            );
        }

        const fullName = `${detailsData.firstName || ''} ${detailsData.lastName || ''}`.trim();
        const email = detailsData.email || detailsData.studentEmail || 'N/A';

        return (
            <div className="bg-[var(--color-bg-primary)] p-6 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {selectedNotification?.type === 'STUDENT_REGISTRATION' 
                            ? 'Student Registration Details'
                            : 'Employee Registration Details'
                        }
                    </h2>
                    <button 
                        onClick={() => {
                            setShowDetailsModal(false);
                            setDetailsData(null);
                            setSelectedNotification(null);
                        }}
                        className="p-2 hover:bg-[var(--color-bg-accent)] rounded-full text-[var(--color-text-primary)]"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
                            Personal Information
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Full Name</p>
                                <p className="text-[var(--color-text-primary)]">{fullName || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Email</p>
                                <p className="text-[var(--color-text-primary)]">{email}</p>
                            </div>
                            {detailsData.StudentId && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Student ID</p>
                                    <p className="text-[var(--color-text-primary)]">{detailsData.StudentId}</p>
                                </div>
                            )}
                            {detailsData.gender && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Gender</p>
                                    <p className="text-[var(--color-text-primary)]">{detailsData.gender}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Details */}
                    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
                            Additional Information
                        </h3>
                        <div className="space-y-3">
                            {detailsData.dateOfBirth && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Date of Birth</p>
                                    <p className="text-[var(--color-text-primary)]">
                                        {new Date(detailsData.dateOfBirth).toLocaleDateString()}
                                    </p>
                                </div>
                            )}
                            {detailsData.primaryDiagnosis && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Primary Diagnosis</p>
                                    <p className="text-[var(--color-text-primary)]">{detailsData.primaryDiagnosis}</p>
                                </div>
                            )}
                            {detailsData.guardianDetails && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Guardian Information</p>
                                    <p className="text-[var(--color-text-primary)]">
                                        {detailsData.guardianDetails.name} ({detailsData.guardianDetails.relation})
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
                            Contact Information
                        </h3>
                        <div className="space-y-3">
                            {detailsData.address && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Address</p>
                                    <p className="text-[var(--color-text-primary)]">{detailsData.address}</p>
                                </div>
                            )}
                            {detailsData.phone && (
                                <div>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Phone</p>
                                    <p className="text-[var(--color-text-primary)]">{detailsData.phone}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Registration Status */}
                    <div className="bg-[var(--color-bg-secondary)] p-4 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4 text-[var(--color-text-primary)]">
                            Registration Status
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Status</p>
                                <p className="text-[var(--color-text-primary)]">Pending Approval</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--color-text-secondary)]">Registration Date</p>
                                <p className="text-[var(--color-text-primary)]">
                                    {new Date(selectedNotification?.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-[var(--color-border-primary)]">
                    <button
                        onClick={() => handleApprove(selectedNotification._id)}
                        className="px-6 py-2 bg-[var(--color-success)] text-white rounded-lg hover:bg-[var(--color-success-hover)] transition-colors"
                    >
                        Approve Registration
                    </button>
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-6 py-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-[var(--color-error-hover)] transition-colors"
                    >
                        Reject Registration
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6 text-[var(--color-text-primary)]">Registration Requests</h2>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    <div className="h-20 bg-[var(--color-bg-accent)] rounded"></div>
                    <div className="h-20 bg-[var(--color-bg-accent)] rounded"></div>
                </div>
            ) : notifications.length === 0 ? (
                <p className="text-center text-[var(--color-text-secondary)] py-4">No pending notifications</p>
            ) : (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {notifications.map((notification) => (
                        <div key={notification._id} 
                            className="border border-[var(--color-border-primary)] rounded-lg p-4 hover:bg-[var(--color-bg-hover)] transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-medium text-[var(--color-text-primary)]">
                                        {notification.type === 'STUDENT_REGISTRATION' 
                                            ? 'Student Registration' 
                                            : 'Employee Registration'}
                                    </p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </p>
                                    <p className="mt-2 text-[var(--color-text-primary)]">{notification.message}</p>
                                </div>
                                <button
                                    onClick={() => handleViewDetails(notification)}
                                    className="px-4 py-2 text-[var(--color-brand)] hover:bg-[var(--color-bg-accent)] rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <Eye size={20} />
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-bg-primary)] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                        {renderDetailsView()}
                    </div>
                </div>
            )}

            {/* Reject Reason Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[var(--color-bg-primary)] rounded-lg p-6 max-w-md w-full m-4">
                        <h3 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
                            Rejection Reason
                        </h3>
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            className="w-full p-3 border border-[var(--color-border-primary)] rounded-lg mb-4 h-32 resize-none bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                            placeholder="Please provide a reason for rejection..."
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setRejectReason('');
                                }}
                                className="px-4 py-2 text-[var(--color-text-primary)] hover:bg-[var(--color-bg-accent)] rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedNotification._id)}
                                className="px-4 py-2 bg-[var(--color-error)] text-white rounded-lg hover:bg-[var(--color-error-hover)] transition-colors"
                                disabled={!rejectReason.trim()}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminNotificationPanel;