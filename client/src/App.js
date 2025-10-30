import React, { useEffect, useState } from 'react';
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import WelcomeModal from './components/WelcomeModal';
import FriendsGallery from './pages/FriendsGallery';
import UserBoard from './pages/UserBoard';
import YourBoard from './pages/YourBoard';
import { getCurrentUser } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    } else {
      setShowWelcome(true);
    }
  }, []);

  const handleUserCreated = (user) => {
    setCurrentUser(user);
    setShowWelcome(false);
  };

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

