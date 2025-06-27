import React from 'react';
import { Link } from 'react-router-dom';
// import './SearchResults.css'; // You'll need to create this CSS file

const SearchResults = ({ results, onClose, searchQuery }) => {
  if (!results || results.length === 0) {
    return (
      <div className="search-results-container">
        <div className="search-results">
          <p>No results found for "{searchQuery}"</p>
          <button onClick={onClose} className="close-results">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results-container">
      <div className="search-results">
        <h4>Results for "{searchQuery}"</h4>
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <Link to={`/destination/${result.id}`} onClick={onClose}>
                {result.name}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="close-results">Close</button>
      </div>
    </div>
  );
};

export default SearchResults;