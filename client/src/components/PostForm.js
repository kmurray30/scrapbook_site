import React, { useState } from 'react';
import { postAPI } from '../services/api';
import './PostForm.css';

const categories = ['Restaurant', 'Movie', 'Book', 'Song', 'Other'];

function PostForm({ onPostCreated, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Restaurant',
    location: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const titleWordCount = formData.title.trim().split(/\s+/).filter(w => w).length;
  const isTitleOverLimit = titleWordCount > 10;
  
  const contentWordCount = formData.content.trim().split(/\s+/).filter(w => w).length;
  const isContentOverLimit = contentWordCount > 20;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    if (isTitleOverLimit) {
      setError('Title must be 10 words or less');
      return;
    }

    if (isContentOverLimit) {
      setError('Content must be 20 words or less');
      return;
    }

    if (formData.category === 'Restaurant' && !formData.location.trim()) {
      setError('Location is required for restaurant posts');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const newPost = await postAPI.createPost(formData);
      onPostCreated(newPost);
      setFormData({ title: '', content: '', category: 'Restaurant', location: '' });
    } catch (err) {
      setError(err.message || 'Failed to create post');
      setIsLoading(false);
    }
  };

  return (
    <div className="post-form-overlay" onClick={onCancel}>
      <div className="post-form-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Create New Post</h2>
        
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value, location: '' })}
              disabled={isLoading}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              Title
              <span className={`word-count ${isTitleOverLimit ? 'over-limit' : ''}`}>
                {titleWordCount}/10 words
              </span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What did you love?"
              disabled={isLoading}
            />
          </div>

          {formData.category === 'Restaurant' && (
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Joe's Pizza, 123 Main St, New York"
                disabled={isLoading}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="content">
              Your Thoughts 
              <span className={`word-count ${isContentOverLimit ? 'over-limit' : ''}`}>
                {contentWordCount}/20 words
              </span>
            </label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share what you loved about it..."
              rows="4"
              disabled={isLoading}
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" onClick={onCancel} disabled={isLoading} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={isLoading || isTitleOverLimit || isContentOverLimit} className="btn-submit">
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostForm;

