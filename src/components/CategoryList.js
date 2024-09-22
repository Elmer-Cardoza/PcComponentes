import React from 'react';

const CategoryList = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="category-list">
      <ul className="list-group">
        {categories.map((category, index) => (
          <li
            key={index}
            className={`list-group-item ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            style={{ cursor: 'pointer' }}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
