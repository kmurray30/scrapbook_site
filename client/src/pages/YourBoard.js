import React, { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { postAPI } from '../services/api';
import './YourBoard.css';

function YourBoard({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, [currentUser]);

  const loadPosts = async () => {
    try {
      setIsLoading(true);
      const userPosts = await postAPI.getUserPosts(currentUser.id);
      setPosts(userPosts);
      setError('');
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setShowPostForm(false);
  };

  return (
    <div className="your-board">
      <div className="board-header">
        <div>
          <h1>Your Board</h1>
          <p className="board-subtitle">Share what you love with the world</p>
        </div>
        <button className="btn-new-post" onClick={() => setShowPostForm(true)}>
          + New Post
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {isLoading ? (
        <div className="loading-state">Loading your posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Start sharing your favorite experiences!</p>
          <button className="btn-empty-cta" onClick={() => setShowPostForm(true)}>
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {showPostForm && (
        <PostForm 
          onPostCreated={handlePostCreated}
          onCancel={() => setShowPostForm(false)}
        />
      )}
    </div>
  );
}

export default YourBoard;

