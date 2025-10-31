import React, { useEffect, useState } from 'react';
import CategoryFilter from '../components/CategoryFilter';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { postAPI } from '../services/api';
import './YourBoard.css';

function YourBoard({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const filteredPosts = selectedCategory === 'All' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

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

      <CategoryFilter 
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      {isLoading ? (
        <div className="loading-state">Loading your posts...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>{selectedCategory === 'All' ? 'No posts yet' : `No ${selectedCategory.toLowerCase()} posts`}</h3>
          <p>{selectedCategory === 'All' ? 'Start sharing your favorite experiences!' : 'Create a post in this category to see it here'}</p>
          {selectedCategory === 'All' && (
            <button className="btn-empty-cta" onClick={() => setShowPostForm(true)}>
              Create Your First Post
            </button>
          )}
        </div>
      ) : (
        <div className="posts-grid">
          {filteredPosts.map(post => (
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

