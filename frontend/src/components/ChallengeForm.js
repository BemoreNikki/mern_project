import React, { useState } from "react";
import "../styles/ChallengeForm.css";

function ChallengeForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: 7,
    frequency: "daily",
    rewards: "Bragging rights!",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="challenge-form" onSubmit={handleSubmit}>
      <h3>Create New Challenge</h3>

      <div className="form-group">
        <label>Challenge Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., 30 Day Fitness Challenge"
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Challenge description"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Duration (days)</label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            max="365"
          />
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
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Reward</label>
        <input
          type="text"
          name="rewards"
          value={formData.rewards}
          onChange={handleChange}
          placeholder="What's the reward?"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">
          Create Challenge
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default ChallengeForm;
