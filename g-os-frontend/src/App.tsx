import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import GlobalLayout from './layouts/GlobalLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import UserDashboard from './pages/UserDashboard';
import MailWorkspace from './pages/MailWorkspace';
import CalendarWorkspace from './pages/CalendarWorkspace';
import Projects from './pages/Projects';
import Team from './pages/Team';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public login Route */}
          <Route path="/login" element={<Login />} />

          {/* Secure Layout Workspace Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <GlobalLayout />
              </ProtectedRoute>
            }
          >
            {/* Direct sub-route index redirect to /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />
            
            {/* Sub pages under standard outlet */}
            <Route path="dashboard" element={<Dashboard />} />
            {/* Role-specific dashboards */}
            <Route
              path="admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="manager-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="employee-dashboard"
              element={
                <ProtectedRoute allowedRoles={["Employee"]}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="user-dashboard"
              element={
                <ProtectedRoute allowedRoles={["User", "Employee", "Manager", "Admin"]}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Workspace paths */}
            <Route path="workspace/mail" element={<MailWorkspace />} />
            <Route path="workspace/calendar" element={<CalendarWorkspace />} />
            
            {/* Projects & Kanban boards */}
            <Route path="projects" element={<Projects />} />
            
            {/* Team management (Private routes validated dynamically inside GlobalLayout navigation list) */}
            <Route path="team" element={<Team />} />
            <Route path="team/timesheets" element={<Team />} />
            <Route path="team/leaves" element={<Team />} />
            <Route path="team/kpis" element={<Team />} />

            {/* Platform Integrations */}
            <Route path="integrations" element={<Integrations />} />

            {/* Core Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Fallback to dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
