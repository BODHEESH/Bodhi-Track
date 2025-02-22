import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import DSATracker from './pages/DSATracker';
import SystemDesignTracker from './pages/SystemDesignTracker';
import DevOpsTracker from './pages/DevOpsTracker';
import Projects from './pages/Projects';
import Planning from './pages/Planning';
import Resources from './pages/Resources';
import Community from './pages/Community';
import Settings from './pages/Settings';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="dsa" element={
              <PrivateRoute>
                <DSATracker />
              </PrivateRoute>
            } />
            <Route path="system-design" element={
              <PrivateRoute>
                <SystemDesignTracker />
              </PrivateRoute>
            } />
            <Route path="devops" element={
              <PrivateRoute>
                <DevOpsTracker />
              </PrivateRoute>
            } />
            <Route path="projects" element={
              <PrivateRoute>
                <Projects />
              </PrivateRoute>
            } />
            <Route path="planning" element={
              <PrivateRoute>
                <Planning />
              </PrivateRoute>
            } />
            <Route path="resources" element={
              <PrivateRoute>
                <Resources />
              </PrivateRoute>
            } />
            <Route path="community" element={
              <PrivateRoute>
                <Community />
              </PrivateRoute>
            } />
            <Route path="settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
