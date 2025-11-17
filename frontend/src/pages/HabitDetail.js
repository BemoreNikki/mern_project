import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/HabitDetail.css";
import WeeklyChart from "../components/WeeklyChart";
import MonthlyChart from "../components/MonthlyChart";

function HabitDetail({ API }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [habit, setHabit] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  useEffect(() => {
    loadHabitDetails();
  }, [id]);

  const loadHabitDetails = async () => {
    try {
      setLoading(true);
      const [habitRes, weeklyRes, completionRes] = await Promise.all([
        API.get(`/habits/${id}`),
        API.get(`/analytics/weekly/${id}`),
        API.get(`/analytics/completion/${id}`),
      ]);

      setHabit(habitRes.data);
      setWeeklyData(weeklyRes.data);
      setCompletionRate(completionRes.data.completionRate);
    } catch (error) {
      console.error("Error loading habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMonthlyData = async () => {
    try {
      const response = await API.get(`/analytics/monthly/${id}`, {
        params: { month: selectedMonth },
      });
      setMonthlyData(response.data);
    } catch (error) {
      console.error("Error loading monthly data:", error);
    }
  };

  useEffect(() => {
    loadMonthlyData();
  }, [selectedMonth]);

  if (loading) return <div className="habit-detail-loading">Loading...</div>;
  if (!habit) return <div>Habit not found</div>;

  return (
    <div className="habit-detail">
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="habit-header">
        <div className="habit-title">
          <span className="habit-icon" style={{ backgroundColor: habit.color }}>
            {habit.icon}
          </span>
          <div>
            <h1>{habit.name}</h1>
            <p className="category-badge">{habit.category}</p>
          </div>
        </div>
        <div className="habit-stats">
          <div className="stat">
            <span className="stat-label">Current Streak</span>
            <span className="stat-value">{habit.currentStreak} 🔥</span>
          </div>
          <div className="stat">
            <span className="stat-label">Longest Streak</span>
            <span className="stat-value">{habit.longestStreak}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completions</span>
            <span className="stat-value">{habit.totalCompletions}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Completion Rate</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>
      </div>

      <div className="habit-description">
        <p>{habit.description || "No description"}</p>
        <p className="frequency">
          📅 {habit.frequency} • ⏰ {habit.reminderTime}
        </p>
      </div>

      <div className="charts-container">
        <div className="chart-section">
          <h2>Weekly Progress</h2>
          <WeeklyChart data={weeklyData} />
        </div>

        <div className="chart-section">
          <h2>Monthly Progress</h2>
          <div className="month-selector">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {[
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ].map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          {monthlyData.dailyBreakdown && <MonthlyChart data={monthlyData} />}
        </div>
      </div>
    </div>
  );
}

export default HabitDetail;
