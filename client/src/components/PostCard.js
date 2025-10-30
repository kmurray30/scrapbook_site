import React from 'react';
import './PostCard.css';

const categoryIcons = {
  Restaurant: '🍽️',
  Movie: '🎬',
  Book: '📚',
  Song: '🎵',
  Other: '✨',
};

function PostCard({ post }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getGoogleMapsEmbedUrl = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedLocation}`;
  };

  const getGoogleMapsSearchUrl = (location) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`;
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-category">
          <span className="category-icon">{categoryIcons[post.category] || '✨'}</span>
          <span className="category-name">{post.category}</span>
        </div>
        <span className="post-date">{formatDate(post.createdAt)}</span>
      </div>

      <h3 className="post-title">{post.title}</h3>
      <p className="post-content">{post.content}</p>

      {post.category === 'Restaurant' && post.location && (
        <div className="post-location">
          <div className="location-header">
            <span className="location-icon">📍</span>
            <span className="location-text">{post.location}</span>
          </div>
          <a 
            href={getGoogleMapsSearchUrl(post.location)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="maps-link"
          >
            View on Google Maps →
          </a>
        </div>
      )}
    </div>
  );
}

export default PostCard;

