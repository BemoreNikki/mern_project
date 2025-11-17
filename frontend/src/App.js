import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HabitDetail from "./pages/HabitDetail";
import Analytics from "./pages/Analytics";
import Challenges from "./pages/Challenges";
import Navbar from "./components/Navbar";

const API = axios.create({ baseURL: "/api" });

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
  }, [token]);

  const checkAuth = async () => {
    try {
      const response = await API.get("/auth/me");
      setUser({ userId: response.data.userId, token });
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete API.defaults.headers.common["Authorization"];
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <div className="app-container">
            <Routes>
              <Route path="/" element={<Dashboard user={user} API={API} />} />
              <Route path="/habit/:id" element={<HabitDetail API={API} />} />
              <Route path="/analytics" element={<Analytics API={API} />} />
              <Route
                path="/challenges"
                element={<Challenges API={API} user={user} />}
              />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export { API };
export default App;
