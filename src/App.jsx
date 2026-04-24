import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import FormSection from './components/FormSection';
import HowItWorks from './components/HowItWorks';
import ReportDashboard from './components/ReportDashboard';

function LoginScreen({ onLogin }) {
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const cleanPwd = password.trim().toLowerCase();
    
    // Accept either role's password just in case, but assign the selected role
    // Or just make it case-insensitive
    if (role === 'teacher' && cleanPwd === 'teacher123') {
      onLogin('teacher');
    } else if (role === 'student' && cleanPwd === 'student123') {
      onLogin('student');
    } else {
      setError('Invalid password. (Hint: use student123 or teacher123)');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
            Plagiarism<span style={{ color: '#4f46e5' }}>Detector</span>
          </h1>
          <p style={{ color: '#666', marginTop: '10px' }}>Please login to continue</p>
        </div>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Select Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '1rem' }}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#444' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter password"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
            />
          </div>
          {error && <div style={{ color: '#ef4444', fontSize: '0.9rem', textAlign: 'center', fontWeight: '500' }}>{error}</div>}
          <button type="submit" style={{ padding: '14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem', marginTop: '10px', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#4338ca'} onMouseOut={(e) => e.target.style.background = '#4f46e5'}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

function StudentSection() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FormSection />
    </>
  );
}

function TeacherSection() {
  return (
    <>
      <ReportDashboard />
    </>
  );
}

function Navigation({ userRole, onLogout }) {
  const location = useLocation();
  const isTeacherPath = location.pathname === '/teacher';

  return (
    <nav style={{
      padding: '1rem 2rem',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
        Plagiarism<span style={{ color: '#4f46e5' }}>Detector</span>
      </div>
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {userRole === 'teacher' && (
          <div style={{ display: 'flex', gap: '15px', marginRight: '10px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: isTeacherPath ? '#666' : '#4f46e5', fontWeight: isTeacherPath ? 'normal' : '600' }}>Student Portal</Link>
            <Link to="/teacher" style={{ textDecoration: 'none', color: isTeacherPath ? '#4f46e5' : '#666', fontWeight: isTeacherPath ? '600' : 'normal' }}>Teacher Dashboard</Link>
          </div>
        )}
        <span style={{ color: '#666', fontSize: '0.9rem', fontWeight: '500' }}>
          Logged in as: <span style={{ color: '#4f46e5', textTransform: 'capitalize', fontWeight: 'bold' }}>{userRole}</span>
        </span>
        <button onClick={onLogout} style={{ padding: '8px 16px', background: '#f1f5f9', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'background 0.2s' }} onMouseOver={(e) => e.target.style.background = '#e2e8f0'} onMouseOut={(e) => e.target.style.background = '#f1f5f9'}>
          Logout
        </button>
      </div>
    </nav>
  );
}

function App() {
  const [userRole, setUserRole] = useState(null);

  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navigation userRole={userRole} onLogout={() => setUserRole(null)} />
        <Routes>
          {userRole === 'student' ? (
            <>
              <Route path="/" element={<StudentSection />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<StudentSection />} />
              <Route path="/teacher" element={<TeacherSection />} />
              <Route path="*" element={<Navigate to="/teacher" replace />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;