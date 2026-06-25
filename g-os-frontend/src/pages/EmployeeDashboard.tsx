import React from 'react';

const EmployeeDashboard: React.FC = () => {
  const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
  const user = stored ? JSON.parse(stored) : null;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Employee Dashboard</h1>
      <p className="mt-2">Welcome{user ? `, ${user.name}` : ''}. This is the employee area.</p>
    </div>
  );
};

export default EmployeeDashboard;
