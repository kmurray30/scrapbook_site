import React, { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import WelcomeModal from './components/WelcomeModal';
import FriendsGallery from './pages/FriendsGallery';
import UserBoard from './pages/UserBoard';
import YourBoard from './pages/YourBoard';
import { getCurrentUser, userAPI } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initializeUser() {
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
        applyTheme(user.themeColor || 'purple');
        setLoading(false);
      } else {
        // Auto-claim a sample user
        try {
          const claimedUser = await userAPI.autoClaimUser();
          setCurrentUser(claimedUser);
          applyTheme(claimedUser.themeColor || 'purple');
          console.log('Auto-claimed user:', claimedUser.displayName);
        } catch (error) {
          console.error('Failed to auto-claim user:', error);
          // Fall back to welcome modal if auto-claim fails
          setShowWelcome(true);
        }
        setLoading(false);
      }
    }
    initializeUser();
  }, []);

  const applyTheme = (color) => {
    document.body.setAttribute('data-theme', color);
  };

  const handleThemeChange = async (e) => {
    const newTheme = e.target.value;
    
    if (!currentUser) {
      alert('Please create your account first before changing colors!');
      return;
    }
    
    try {
      const updatedUser = await userAPI.updateTheme(newTheme);
      setCurrentUser(updatedUser);
      applyTheme(newTheme);
    } catch (error) {
      console.error('Failed to update theme:', error);
      // If user not found, they need to refresh and create account again
      if (error.message && error.message.includes('not found')) {
        alert('Your session expired. Please refresh the page and enter your name again.');
      } else {
        alert('Failed to update theme. Please try refreshing the page.');
      }
    }
  };

  const handleUserCreated = (user) => {
    setCurrentUser(user);
    setShowWelcome(false);
    applyTheme(user.themeColor || 'purple');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (showWelcome) {
    return <WelcomeModal onUserCreated={handleUserCreated} />;
  }

  if (!currentUser) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-content">
            <h1 className="nav-logo">📖 Scrapbook</h1>
            <div className="nav-links">
              <Link to="/" className="nav-link">Your Board</Link>
              <Link to="/friends" className="nav-link">Friends</Link>
            </div>
            <div className="nav-user">
              <div className="theme-selector">
                <select 
                  className="theme-dropdown" 
                  value={currentUser.themeColor || 'purple'}
                  onChange={handleThemeChange}
                >
                  <option value="purple">💜 Purple</option>
                  <option value="green">💚 Green</option>
                  <option value="pink">💗 Pink</option>
                  <option value="blue">💙 Blue</option>
                  <option value="yellow">💛 Yellow</option>
                  <option value="orange">🧡 Orange</option>
                  <option value="red">❤️ Red</option>
                </select>
              </div>
              <span className="user-name">{currentUser.displayName}</span>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<YourBoard currentUser={currentUser} />} />
            <Route path="/friends" element={<FriendsGallery currentUser={currentUser} />} />
            <Route path="/user/:userId" element={<UserBoard currentUser={currentUser} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

