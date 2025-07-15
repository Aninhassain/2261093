import React, { useState } from 'react';
import ShortenForm from './ShortenForm';
import StatsPage from './StatsPage';
import './App.css';

function App() {
  const [showStats, setShowStats] = useState(false);

  return (
    <div className="main-container">
      <header>
        <h1>URL Shortener</h1>
        <div className="tabs">
          <button onClick={() => setShowStats(false)}>Shorten URL</button>
          <button onClick={() => setShowStats(true)}>View Stats</button>
        </div>
      </header>

      <div className="content">
        {showStats ? <StatsPage /> : <ShortenForm />}
      </div>
    </div>
  );
}

export default App;
