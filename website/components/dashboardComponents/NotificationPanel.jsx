import React from 'react';

const notifications = [
  {
    id: 1,
    type: 'report',
    message: 'New progress report submitted by Dr. Sarah Wilson',
    time: '10 minutes ago',
  },
  {
    id: 2,
    type: 'absence',
    message: 'Alex M. marked absent for today’s session',
    time: '1 hour ago',
  },
  {
    id: 3,
    type: 'leave',
    message: 'Ms. Emily Parker requested leave for next week',
    time: '2 hours ago',
  },
];

const NotificationPanel = () => {
  const getDotColor = (type) => {
    switch (type) {
      case 'report':
        return 'var(--color-info)';
      case 'absence':
        return 'var(--color-error)';
      case 'leave':
        return 'var(--color-warning)';
      default:
        return 'var(--color-text-secondary)';
    }
  };

  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4">Recent Notifications</h3>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-300 hover:bg-[var(--color-bg-secondary)]"
          >
            <div
              className="w-2 h-2 mt-2 rounded-full"
              style={{
                backgroundColor: getDotColor(notification.type),
              }}
            />

            <div>
              <p className="text-sm text-[var(--color-text-primary)] transition-colors duration-300">
                {notification.message}
              </p>

              <p className="text-xs text-[var(--color-text-secondary)] mt-1 transition-colors duration-300">
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPanel;
