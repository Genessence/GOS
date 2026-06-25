import React from 'react';

const UserDashboard: React.FC = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = stored ? JSON.parse(stored) : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">User Dashboard</h1>
      <p className="mt-2">Welcome{user ? `, ${user.name}` : ''}. This is your dashboard.</p>
    </div>
  );
};

export default UserDashboard;
