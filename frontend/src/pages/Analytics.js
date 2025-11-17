import React, { useState, useEffect } from "react";
import "../styles/Analytics.css";
import { API } from "../App";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [dashRes, perfRes] = await Promise.all([
        API.get("/analytics/dashboard/summary"),
        API.get("/analytics/insights/performance"),
      ]);

      setAnalyticsData(dashRes.data);
      setPerformance(perfRes.data);
    } catch (error) {
      console.error("Error loading analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading">Loading...</div>;

  return (
    <div className="analytics">
      <h1>Analytics Dashboard</h1>

      <div className="analytics-grid">
        {analyticsData.map((habit) => (
          <div key={habit.habitId} className="analytics-card">
            <h3>{habit.name}</h3>
            <div className="metric">
              <span>Completion Rate: {habit.completionRate}%</span>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${habit.completionRate}%` }}
                ></div>
              </div>
            </div>
            <div className="metric">
              <span>Current Streak: {habit.currentStreak}🔥</span>
            </div>
            <div className="metric">
              <span>Total Completions: {habit.totalCompletions}</span>
            </div>
          </div>
        ))}
      </div>

      {performance && (
        <div className="performance-section">
          <div className="best-habits">
            <h2>Top Habits 🏆</h2>
            {performance.bestHabits.map((habit, idx) => (
              <div key={idx} className="habit-rank">
                <span className="rank">#{idx + 1}</span>
                <div>
                  <p className="habit-name">{habit.name}</p>
                  <p className="habit-rate">
                    {habit.completionRate}% - Streak: {habit.streak}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="worst-habits">
            <h2>Need Improvement 📈</h2>
            {performance.worstHabits.map((habit, idx) => (
              <div key={idx} className="habit-rank">
                <span className="rank">⚠️</span>
                <div>
                  <p className="habit-name">{habit.name}</p>
                  <p className="habit-rate">
                    {habit.completionRate}% - Streak: {habit.streak}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;
