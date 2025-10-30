import React, { useState } from 'react';
import { userAPI } from '../services/api';
import './WelcomeModal.css';

function WelcomeModal({ onUserCreated }) {
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError('Please enter a name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await userAPI.init(displayName.trim());
      onUserCreated(user);
    } catch (err) {
      setError(err.message || 'Failed to create account');
      setIsLoading(false);
    }
  };

  return (
    <div className="welcome-overlay">
      <div className="welcome-modal">
        <h1>📖 Welcome to Scrapbook</h1>
        <p className="welcome-subtitle">Share your favorite experiences with friends</p>
        
        <form onSubmit={handleSubmit} className="welcome-form">
          <label htmlFor="displayName">What should we call you?</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your name"
            disabled={isLoading}
            autoFocus
          />
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Get Started'}
          </button>
        </form>

        <p className="welcome-note">
          Your account is tied to this device. You can upgrade to a Google account later.
        </p>
      </div>
    </div>
  );
}

export default WelcomeModal;

