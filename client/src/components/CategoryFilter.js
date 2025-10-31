import React from 'react';
import './CategoryFilter.css';

const categories = ['All', 'Restaurant', 'Movie', 'Book', 'Song', 'Other'];

const categoryIcons = {
  All: '✨',
  Restaurant: '🍽️',
  Movie: '🎬',
  Book: '📚',
  Song: '🎵',
  Other: '✨',
};

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      <label className="filter-label">Filter by:</label>
      <div className="filter-pills">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="pill-icon">{categoryIcons[category]}</span>
            <span className="pill-text">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;

