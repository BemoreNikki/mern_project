import React from "react";
import "../styles/StatsOverview.css";

function StatsOverview({ stats }) {
  return (
    <div className="stats-overview">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <span className="stat-label">Total Habits</span>
          <span className="stat-number">{stats.totalHabits || 0}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🔥</div>
        <div className="stat-content">
          <span className="stat-label">Active Streaks</span>
          <span className="stat-number">{stats.activeStreaks || 0}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">🏆</div>
        <div className="stat-content">
          <span className="stat-label">Max Streak</span>
          <span className="stat-number">{stats.maxStreak || 0}</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">📈</div>
        <div className="stat-content">
          <span className="stat-label">Average Streak</span>
          <span className="stat-number">{stats.averageStreak || 0}</span>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
