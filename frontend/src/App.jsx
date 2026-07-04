import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Landing from './Landing';
import Auth from './Auth';
import Dashboard from './Dashboard';
import Workspace from './Workspace';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import Settings from './Settings';
import AdminDashboard from './AdminDashboard';
import AddProblem from './AddProblem';
import Contests from './Contests'; 
import ContestArena from './ContestArena'; 

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedRole = sessionStorage.getItem('role');
    if (savedToken) {
        setToken(savedToken);
        setRole(savedRole || 'user');
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background: '#020617', border: '1px solid #1e293b', color: '#fff' } }} />
      
      {!token ? (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth setToken={setToken} setRole={setRole} />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      ) : (
        <>
            {role === 'admin' ? (
                <Routes>
                    <Route path="/admin" element={<AdminDashboard handleLogout={handleLogout} />} />
                    <Route path="/admin/add-problem" element={<AddProblem />} />
                    <Route path="/admin/edit-problem/:id" element={<AddProblem />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* Admins can also view contests */}
                    <Route path="/contests" element={<Contests />} />
                    <Route path="/contest/:id" element={<ContestArena />} />
                    <Route path="*" element={<Navigate to="/admin" />} />
                </Routes>
            ) : (
                <Routes>
                    <Route path="/" element={<Dashboard handleLogout={handleLogout} />} />
                    <Route path="/problem/:id" element={<Workspace />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/settings" element={<Settings />} />
                    {/* User Contest Routes */}
                    <Route path="/contests" element={<Contests />} />
                    <Route path="/contest/:id" element={<ContestArena />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            )}
        </>
      )}
    </BrowserRouter>
  )
}

export default App;