import React from "react";
import "../styles/Navbar.css";
import { useNavigate } from "react-router-dom";

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo" onClick={() => navigate("/")}>
          🎯 Habit Tracker
        </div>

        <ul className="nav-menu">
          <li>
            <button onClick={() => navigate("/")}>Dashboard</button>
          </li>
          <li>
            <button onClick={() => navigate("/analytics")}>Analytics</button>
          </li>
          <li>
            <button onClick={() => navigate("/challenges")}>Challenges</button>
          </li>
        </ul>

        <div className="nav-user">
          <span className="user-info">👤 {user?.username || "User"}</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
