import React, { useState } from "react";
import "../styles/HabitForm.css";

function HabitForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "health",
    frequency: "daily",
    priority: 3,
    reminderTime: "09:00",
    color: "#3B82F6",
    icon: "✓",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      category: "health",
      frequency: "daily",
      priority: 3,
      reminderTime: "09:00",
      color: "#3B82F6",
      icon: "✓",
    });
  };

  return (
    <form className="habit-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Habit Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter habit name"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Why is this habit important?"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="health">❤️ Health</option>
            <option value="fitness">💪 Fitness</option>
            <option value="learning">📚 Learning</option>
            <option value="productivity">⚡ Productivity</option>
            <option value="mindfulness">🧘 Mindfulness</option>
            <option value="social">👥 Social</option>
            <option value="other">✨ Other</option>
          </select>
        </div>

        <div className="form-group">
          <label>Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="1">Low</option>
            <option value="2">Medium-Low</option>
            <option value="3">Medium</option>
            <option value="4">Medium-High</option>
            <option value="5">High</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Reminder Time</label>
          <input
            type="time"
            name="reminderTime"
            value={formData.reminderTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Color</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Icon</label>
          <input
            type="text"
            name="icon"
            maxLength="2"
            value={formData.icon}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Create Habit
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default HabitForm;
