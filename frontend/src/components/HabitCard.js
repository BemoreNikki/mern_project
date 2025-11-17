import React from "react";
import "../styles/HabitCard.css";
import { useNavigate } from "react-router-dom";

function HabitCard({ habit, isCheckedInToday, onCheckIn, onDelete }) {
  const navigate = useNavigate();

  const categoryEmojis = {
    health: "❤️",
    fitness: "💪",
    learning: "📚",
    productivity: "⚡",
    mindfulness: "🧘",
    social: "👥",
    other: "✨",
  };

  return (
    <div
      className="habit-card"
      style={{ borderLeft: `5px solid ${habit.color}` }}
    >
      <div className="card-header">
        <div
          className="habit-info"
          onClick={() => navigate(`/habit/${habit._id}`)}
        >
          <div
            className="habit-icon-large"
            style={{ backgroundColor: habit.color }}
          >
            {habit.icon}
          </div>
          <div>
            <h3>{habit.name}</h3>
            <p className="category">
              {categoryEmojis[habit.category]} {habit.category}
            </p>
          </div>
        </div>
        <button className="delete-btn" onClick={onDelete}>
          ×
        </button>
      </div>

      <div className="card-stats">
        <div className="stat-item">
          <span className="label">Streak</span>
          <span className="value">{habit.currentStreak} 🔥</span>
        </div>
        <div className="stat-item">
          <span className="label">Best</span>
          <span className="value">{habit.longestStreak}</span>
        </div>
        <div className="stat-item">
          <span className="label">Total</span>
          <span className="value">{habit.totalCompletions}</span>
        </div>
      </div>

      <div className="card-footer">
        <button
          className={`checkin-btn ${isCheckedInToday ? "checked" : ""}`}
          onClick={onCheckIn}
          disabled={isCheckedInToday}
        >
          {isCheckedInToday ? "✓ Done Today" : "+ Check In"}
        </button>
      </div>
    </div>
  );
}

export default HabitCard;
