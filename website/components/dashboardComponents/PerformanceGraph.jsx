import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Communication', completed: 75, target: 100 },
  { name: 'Social Skills', completed: 85, target: 100 },
  { name: 'Motor Skills', completed: 60, target: 100 },
  { name: 'Cognitive', completed: 90, target: 100 },
];

const PerformanceGraph = () => {
  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4">Performance Analytics</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)' }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={{ stroke: 'var(--color-border)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-primary)',
              }}
            />
            <Bar dataKey="completed" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-[var(--color-success-bg)] transition-colors duration-300">
          <p className="text-sm text-[var(--color-success-text)]">85% Average Progress</p>
        </div>

        <div className="p-3 rounded-lg bg-[var(--color-info-bg)] transition-colors duration-300">
          <p className="text-sm text-[var(--color-info-text)]">12 Programs Completed</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraph;
