import React, { useState, useEffect } from "react";
import "../styles/Challenges.css";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeForm from "../components/ChallengeForm";

function Challenges({ API, user }) {
  const [challenges, setChallenges] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const [allRes, myRes] = await Promise.all([
        API.get("/challenges"),
        API.get("/challenges/user/my-challenges"),
      ]);

      setChallenges(allRes.data);
      setMyChallenges(myRes.data);
    } catch (error) {
      console.error("Error loading challenges:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateChallenge = async (data) => {
    try {
      const response = await API.post("/challenges", data);
      setMyChallenges([...myChallenges, response.data]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating challenge:", error);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    try {
      await API.post(`/challenges/${challengeId}/join`);
      loadChallenges();
    } catch (error) {
      console.error("Error joining challenge:", error);
    }
  };

  if (loading) return <div className="challenges-loading">Loading...</div>;

  const displayChallenges = activeTab === "my" ? myChallenges : challenges;

  return (
    <div className="challenges">
      <div className="challenges-header">
        <h1>Challenges</h1>
        <button className="create-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Challenge"}
        </button>
      </div>

      {showForm && (
        <ChallengeForm
          onSubmit={handleCreateChallenge}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="challenge-tabs">
        <button
          className={`tab ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Challenges
        </button>
        <button
          className={`tab ${activeTab === "my" ? "active" : ""}`}
          onClick={() => setActiveTab("my")}
        >
          My Challenges
        </button>
      </div>

      <div className="challenges-grid">
        {displayChallenges.length === 0 ? (
          <p className="no-challenges">
            {activeTab === "my"
              ? "You have not joined any challenges yet"
              : "No challenges available"}
          </p>
        ) : (
          displayChallenges.map((challenge) => (
            <ChallengeCard
              key={challenge._id}
              challenge={challenge}
              onJoin={() => handleJoinChallenge(challenge._id)}
              isJoined={myChallenges.some((c) => c._id === challenge._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Challenges;
