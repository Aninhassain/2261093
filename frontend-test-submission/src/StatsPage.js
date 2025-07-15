import React, { useState } from 'react';
import axios from 'axios';

function StatsPage() {
  const [stats, setStats] = useState([]);
  const [shortcode, setShortcode] = useState('');
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortcode}`);
      setStats(res.data);
      setError('');
    } catch (err) {
      setStats([]);
      setError('Stats not found or link expired.');
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter shortcode"
        value={shortcode}
        onChange={(e) => setShortcode(e.target.value)}
      />
      <button onClick={fetchStats}>Get Stats</button>

      {error && <p className="error">{error}</p>}

      {stats.shortcode && (
        <div className="stat-box">
          <p><strong>Original URL:</strong> {stats.originalURL}</p>
          <p><strong>Total Clicks:</strong> {stats.clicks}</p>
          <p><strong>Created At:</strong> {stats.createdAt}</p>
          <p><strong>Expires At:</strong> {stats.expiresAt}</p>

          <h4>Click History</h4>
          <ul>
            {stats.clickHistory?.map((c, i) => (
              <li key={i}>{c.timestamp} – {c.location || 'Unknown'}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default StatsPage;
