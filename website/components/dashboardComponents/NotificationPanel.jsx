import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationPanel = () => {
  // ✅ Destructuring notifications array from the context object
  const { notifications } = useContext(AppContext);
  const notificationArray = notifications.notifications;

  // Debug logs
  console.log('Notifications array:', notifications.notifications);
  console.log('Is array:', Array.isArray(notifications));
  console.log('Length:', notifications.length);

  const getDotColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'var(--color-error)';
      case 'NORMAL':
        return 'var(--color-info)';
      case 'LOW':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4">All Notifications</h3>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {Array.isArray(notificationArray) && notificationArray.length > 0 ? (
          notificationArray.map((notification) => (
            <div
              key={notification._id}
              className="flex items-start space-x-3 p-3 rounded-lg transition-colors duration-300 hover:bg-[var(--color-bg-hover)]"
            >
              <div
                className="w-2 h-2 mt-2 rounded-full"
                style={{
                  backgroundColor: getDotColor(notification.priority),
                }}
              />

              <div className="flex-1">
                <p className="text-sm text-[var(--color-text-primary)] transition-colors duration-300">
                  {notification.message}
                </p>

                <p className="text-xs text-[var(--color-text-secondary)] mt-1 transition-colors duration-300">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })} • Admin
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[var(--color-text-secondary)] py-4">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
