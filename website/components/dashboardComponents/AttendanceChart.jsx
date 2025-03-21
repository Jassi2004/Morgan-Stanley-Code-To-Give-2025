import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Mon', attendance: 92 },
  { name: 'Tue', attendance: 88 },
  { name: 'Wed', attendance: 95 },
  { name: 'Thu', attendance: 90 },
  { name: 'Fri', attendance: 85 },
];

const AttendanceChart = () => {
  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4">Attendance Overview</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border-secondary)"
            />
            <XAxis
              dataKey="name"
              stroke="var(--color-text-secondary)"
            />
            <YAxis
              stroke="var(--color-text-secondary)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-accent)',
                borderColor: 'var(--color-border-primary)',
                color: 'var(--color-text-primary)',
                borderRadius: '0.5rem',
              }}
            />
            <Area
              type="monotone"
              dataKey="attendance"
              stroke="var(--color-brand)"
              fill="var(--color-brand-light)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 rounded-lg"
        style={{
          backgroundColor: 'var(--color-warning-light)',
          color: 'var(--color-warning)',
        }}
      >
        <p className="text-sm">⚠️ 3 students have attendance below 85%</p>
      </div>
    </div>
  );
};

export default AttendanceChart;
