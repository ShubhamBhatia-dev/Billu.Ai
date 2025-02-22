import { useEffect } from 'react';
import "./index.css";
import { LoginPage } from './pages/login';
import { Dashboard } from './pages/dashboard';
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

// Component handling localStorage check and routing
function MainApp() {
  const navigate = useNavigate();

  useEffect(() => {
    const userName = localStorage.getItem("name");

    const currentPath = window.location.pathname;
    // Redirect to dashboard if user exists in localStorage
    if (userName && currentPath === "/") {
      navigate("/dash");
      //  Redirect to login if user doesn't exist      
    } else if (!userName && currentPath === "/dash") {
      navigate("/");

    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dash" element={<Dashboard />} />
    </Routes>
  );
}

// Main App component with Router
function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

export default App;
