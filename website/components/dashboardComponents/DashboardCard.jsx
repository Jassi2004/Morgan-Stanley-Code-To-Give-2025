import React from 'react';

const DashboardCard = ({ title, value, change, icon, actionLabel, onClick }) => {
  return (
    <div
      className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: 'var(--color-brand-light)',
            color: 'var(--color-brand)',
          }}
        >
          {icon}
        </div>

        {actionLabel && (
          <button
            onClick={onClick}
            className="text-sm font-medium transition-colors duration-300 cursor-pointer hover:text-[var(--color-brand-hover)]"
            style={{
              color: 'var(--color-brand)',
            }}
          >
            {actionLabel}
          </button>
        )}
      </div>

      <h3 className="text-2xl font-bold text-[var(--color-text-secondary)] transition-colors duration-300">
        {value}
      </h3>

      <p className="text-sm text-[var(--color-text-secondary)] mt-1 transition-colors duration-300">
        {title}
      </p>

      {change && (
        <p
          className="text-sm mt-2 transition-colors duration-300"
          style={{
            color: 'var(--color-success)',
          }}
        >
          {change}
        </p>
      )}
    </div>
  );
};

export default DashboardCard;
