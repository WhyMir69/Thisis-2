import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PitchHistory from './pages/PitchHistory';
import PitchTypeSelection from './pages/PitchTypeSelection';
import PitchContent from './pages/PitchContent';
import FeedbackResults from './pages/FeedbackResults';
import Profile from './pages/Profile';

// Import components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// A layout component to wrap pages that need a sidebar and header
const MainLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header title="Dashboard" />
        <div className="content-body">
          {children}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes (wrapped in MainLayout) */}
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/history" element={<MainLayout><PitchHistory /></MainLayout>} />
        <Route path="/profile" element={<MainLayout><Profile /></MainLayout>} />
        <Route path="/pitch/type" element={<MainLayout><PitchTypeSelection /></MainLayout>} />
        <Route path="/pitch/content" element={<MainLayout><PitchContent /></MainLayout>} />
        <Route path="/pitch/feedback" element={<MainLayout><FeedbackResults /></MainLayout>} />
      </Routes>
    </Router>
  );
}

export default App;