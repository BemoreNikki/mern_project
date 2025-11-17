import React, { useState, useEffect } from "react";
import "../styles/Dashboard.css";
import HabitCard from "../components/HabitCard";
import HabitForm from "../components/HabitForm";
import StatsOverview from "../components/StatsOverview";

function Dashboard({ API }) {
  const [habits, setHabits] = useState([]);
  const [todayCheckIns, setTodayCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [habitsRes, checkInsRes, streaksRes] = await Promise.all([
        API.get("/habits"),
        API.get("/checkins/today"),
        API.get("/streaks/stats/summary"),
      ]);

      setHabits(habitsRes.data);
      setTodayCheckIns(checkInsRes.data);
      setStats(streaksRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHabit = async (habitData) => {
    try {
      const response = await API.post("/habits", habitData);
      setHabits([...habits, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleCheckIn = async (habitId) => {
    try {
      const response = await API.post("/checkins", { habitId });
      loadData();
    } catch (error) {
      console.error("Error checking in:", error);
    }
  };

  const handleDeleteHabit = async (habitId) => {
    try {
      await API.delete(`/habits/${habitId}`);
      setHabits(habits.filter((h) => h._id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  if (loading) return <div className="dashboard-loading">Loading...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          className="add-habit-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Habit"}
        </button>
      </div>

      <StatsOverview stats={stats} />

      {showForm && (
        <HabitForm
          onSubmit={handleAddHabit}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="habits-section">
        <h2>Today's Habits</h2>
        {habits.length === 0 ? (
          <p className="no-habits">No habits yet. Create one to get started!</p>
        ) : (
          <div className="habits-grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                isCheckedInToday={todayCheckIns.some(
                  (c) => c.habitId === habit._id
                )}
                onCheckIn={() => handleCheckIn(habit._id)}
                onDelete={() => handleDeleteHabit(habit._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
