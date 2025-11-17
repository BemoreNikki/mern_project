import React from "react";
import "../styles/ChallengeCard.css";

function ChallengeCard({ challenge, onJoin, isJoined }) {
  const participantCount = challenge.participants?.length || 0;
  const daysLeft = Math.ceil(
    (new Date(challenge.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <h3>{challenge.name}</h3>
        <span className="duration">{daysLeft} days left</span>
      </div>

      <p className="description">{challenge.description}</p>

      <div className="challenge-meta">
        <div className="meta-item">
          <span className="meta-label">👥 Participants</span>
          <span className="meta-value">{participantCount}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">📅 Frequency</span>
          <span className="meta-value">{challenge.frequency}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">🎁 Reward</span>
          <span className="meta-value">{challenge.rewards}</span>
        </div>
      </div>

      <button
        className={`join-btn ${isJoined ? "joined" : ""}`}
        onClick={onJoin}
        disabled={isJoined}
      >
        {isJoined ? "✓ Joined" : "Join Challenge"}
      </button>
    </div>
  );
}

export default ChallengeCard;
