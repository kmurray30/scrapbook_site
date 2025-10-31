import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CategoryFilter from '../components/CategoryFilter';
import { followAPI, postAPI, userAPI } from '../services/api';
import { getLimitedGroupedPosts } from '../utils/dateUtils';
import './FriendsGallery.css';

const categoryIcons = {
  Restaurant: '🍽️',
  Movie: '🎬',
  Book: '📚',
  Song: '🎵',
  Other: '✨',
};

function FriendsGallery({ currentUser }) {
  const [users, setUsers] = useState([]);
  const [following, setFollowing] = useState(new Set());
  const [userPosts, setUserPosts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load all users except current user
      const allUsers = await userAPI.getAllUsers();
      const otherUsers = allUsers.filter(u => u.id !== currentUser.id);
      
      // Try to load following list (may fail if user not authenticated)
      let followingIds = new Set();
      try {
        const followingList = await followAPI.getFollowing();
        followingIds = new Set(followingList.map(f => f.id));
        setFollowing(followingIds);
      } catch (err) {
        // Silently continue without following data - not critical for viewing
        console.log('Note: Following list not available (this is normal if browsing)');
      }
      
      // Sort users: followed users first, then by creation date
      const sortedUsers = otherUsers.sort((a, b) => {
        const aFollowed = followingIds.has(a.id);
        const bFollowed = followingIds.has(b.id);
        if (aFollowed && !bFollowed) return -1;
        if (!aFollowed && bFollowed) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setUsers(sortedUsers);
      
      // Load recent posts for each user
      const postsMap = {};
      for (const user of sortedUsers) {
        const posts = await postAPI.getUserPosts(user.id);
        postsMap[user.id] = posts;
      }
      setUserPosts(postsMap);
      
    } catch (err) {
      console.error('Failed to load friends gallery:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollowToggle = async (userId, e) => {
    e.stopPropagation();
    
    try {
      if (following.has(userId)) {
        await followAPI.unfollowUser(userId);
        setFollowing(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      } else {
        await followAPI.followUser(userId);
        setFollowing(prev => new Set([...prev, userId]));
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
      alert('Could not update follow status. Please make sure you\'re logged in.');
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`);
  };

  const getFilteredPosts = (posts) => {
    if (selectedCategory === 'All') return posts;
    return posts.filter(post => post.category === selectedCategory);
  };

  const getUserGroupedPosts = (userId) => {
    const posts = userPosts[userId] || [];
    const filtered = getFilteredPosts(posts);
    return getLimitedGroupedPosts(filtered, 3, 4);
  };

  if (isLoading) {
    return <div className="loading-state">Loading friends...</div>;
  }

  return (
    <div className="friends-gallery">
      <div className="gallery-header">
        <h1>Friends Gallery</h1>
        <p className="gallery-subtitle">Discover what your friends are loving</p>
      </div>

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {users.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No other users yet</h3>
          <p>You're one of the first! Share your board with friends to get started.</p>
        </div>
      ) : (
        <div className="users-grid">
          {users.map(user => {
            const groupedPosts = getUserGroupedPosts(user.id);
            const hasVisiblePosts = Object.keys(groupedPosts).length > 0;

            return (
              <div 
                key={user.id} 
                className={`user-card ${following.has(user.id) ? 'following' : ''}`}
                onClick={() => handleUserClick(user.id)}
              >
                {following.has(user.id) && <div className="following-badge">Following</div>}
                
                <div className="user-info">
                  <div className="user-avatar">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <h3 className="user-name">{user.displayName}</h3>
                </div>

                <div className="user-posts-preview">
                  {hasVisiblePosts ? (
                    Object.entries(groupedPosts).map(([groupName, posts]) => (
                      <div key={groupName} className="preview-group">
                        <div className="preview-group-header">{groupName}</div>
                        {posts.map(post => (
                          <div key={post.id} className="preview-item">
                            <span className="preview-icon">
                              {categoryIcons[post.category] || '✨'}
                            </span>
                            <div className="preview-content">
                              <div className="preview-title">{post.title}</div>
                              <div className="preview-text">{post.content}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))
                  ) : (
                    <div className="no-posts">
                      {selectedCategory === 'All' 
                        ? 'No posts yet' 
                        : `No ${selectedCategory.toLowerCase()} posts`}
                    </div>
                  )}
                </div>

                <button 
                  className={`btn-follow ${following.has(user.id) ? 'following' : ''}`}
                  onClick={(e) => handleFollowToggle(user.id, e)}
                >
                  {following.has(user.id) ? 'Unfollow' : 'Follow'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FriendsGallery;

