import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import PostCard from '../components/PostCard';
import { followAPI, postAPI, userAPI } from '../services/api';
import './UserBoard.css';

function UserBoard({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    if (userId == currentUser.id) {
      navigate('/');
      return;
    }
    loadUserData();
  }, [userId, currentUser, navigate]);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      
      // Load user info
      const userData = await userAPI.getUser(userId);
      setUser(userData);
      
      // Load user's posts
      const userPosts = await postAPI.getUserPosts(userId);
      setPosts(userPosts);
      
      // Check follow status (may fail if not authenticated)
      try {
        const followStatus = await followAPI.checkFollowStatus(userId);
        setIsFollowing(followStatus.isFollowing);
      } catch (err) {
        console.log('Note: Follow status not available (this is normal if browsing)');
        setIsFollowing(false);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load user data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followAPI.followUser(userId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      alert('Could not update follow status. Please make sure you\'re logged in.');
    }
  };

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  if (isLoading) {
    return <div className="loading-state">Loading...</div>;
  }

  if (error || !user) {
    return (
      <div className="error-state">
        <h2>User not found</h2>
        <button onClick={() => navigate('/friends')}>Back to Friends</button>
      </div>
    );
  }

  return (
    <div className="user-board">
      <div className="user-board-header">
        <button className="btn-back" onClick={() => navigate('/friends')}>
          ← Back to Friends
        </button>
        
        <div className="user-profile">
          <div className="user-avatar-large">
            {user.displayName.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <h1>{user.displayName}'s Board</h1>
            <p className="user-join-date">
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
          <button 
            className={`btn-follow-user ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowToggle}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>
            {selectedCategory === 'All' 
              ? `${user.displayName} hasn't posted anything yet`
              : `${user.displayName} hasn't posted any ${selectedCategory.toLowerCase()}s yet`}
          </h3>
          <p>Check back later for their recommendations!</p>
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}

export default UserBoard;

