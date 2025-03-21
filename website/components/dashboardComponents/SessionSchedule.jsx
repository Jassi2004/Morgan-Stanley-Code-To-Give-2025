import React from 'react';

const sessions = [
  {
    id: 1,
    time: '09:00 AM',
    title: 'Speech Therapy',
    teacher: 'Dr. Sarah Wilson',
    students: ['Alex M.', 'Emma R.'],
  },
  {
    id: 2,
    time: '10:30 AM',
    title: 'Occupational Therapy',
    teacher: 'Dr. James Brown',
    students: ['Michael K.', 'Sophie L.'],
  },
  {
    id: 3,
    time: '02:00 PM',
    title: 'Group Activity',
    teacher: 'Ms. Emily Parker',
    students: ['Ryan S.', 'Lucy W.', 'Tom H.'],
  },
];

const SessionSchedule = () => {
  return (
    <div className="bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] rounded-xl shadow-sm p-6 transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Today's Sessions</h3>

        <button className="text-sm font-medium text-[var(--color-secondary)] hover:text-[var(--color-secondary-hover)] transition-colors duration-300">
          View Calendar
        </button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="border-l-4 pl-4 py-2 transition-colors duration-300 border-[var(--color-secondary)] hover:bg-[var(--color-bg-secondary)] rounded"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                {session.time}
              </span>

              <span className="text-sm text-[var(--color-text-secondary)]">
                {session.title}
              </span>
            </div>

            <p className="text-sm mt-1 text-[var(--color-text-secondary)]">
              {session.teacher}
            </p>

            <p className="text-sm mt-1 text-[var(--color-text-tertiary)]">
              Students: {session.students.join(', ')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SessionSchedule;
