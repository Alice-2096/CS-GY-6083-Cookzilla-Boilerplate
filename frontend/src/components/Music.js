import React, { useState } from 'react';
import Search from './Search';
import SongList from './SongList';
import '../css/Song.css';
import SearchResultDisplay from './SearchResultDisplay';

export default function Music() {
  const [results, setResults] = useState(null);
  const handleDataFromChild = (data) => {
    setResults(data);
  };

  return (
    <div className="song-page">
      <header className="song-page-header">
        <h4>FatEar -- Songs of the Week</h4>
      </header>
      <SongList></SongList>
      <div className="search-container">
        <Search onData={handleDataFromChild}></Search>
      </div>
      <SearchResultDisplay results={results}></SearchResultDisplay>
    </div>
  );
}
