import React, { useState } from 'react';
import axios from 'axios';

function ShortenForm() {
  const [formData, setFormData] = useState([
    { url: '', shortcode: '', validity: '' }
  ]);
  const [results, setResults] = useState([]);

  const handleChange = (i, field, value) => {
    const newData = [...formData];
    newData[i][field] = value;
    setFormData(newData);
  };

  const addField = () => {
    if (formData.length < 5) {
      setFormData([...formData, { url: '', shortcode: '', validity: '' }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const responses = [];

    for (const data of formData) {
      try {
        const res = await axios.post('http://localhost:5000/shorturls', data);
        responses.push(res.data);
      } catch (err) {
        responses.push({ error: err.response?.data?.error || 'Something went wrong' });
      }
    }

    setResults(responses);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {formData.map((data, i) => (
          <div key={i} className="form-box">
            <input
              type="url"
              placeholder="Long URL"
              required
              value={data.url}
              onChange={(e) => handleChange(i, 'url', e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom shortcode (optional)"
              value={data.shortcode}
              onChange={(e) => handleChange(i, 'shortcode', e.target.value)}
            />
            <input
              type="number"
              placeholder="Validity in mins (default 30)"
              value={data.validity}
              onChange={(e) => handleChange(i, 'validity', e.target.value)}
            />
          </div>
        ))}
        <button type="button" onClick={addField}>+ Add more</button>
        <button type="submit">Generate Short URLs</button>
      </form>

      {results.length > 0 && (
        <div className="results">
          <h3>Generated Links:</h3>
          <ul>
            {results.map((r, idx) => (
              <li key={idx}>
                {r.shortURL
                  ? <a href={r.shortURL} target="_blank" rel="noreferrer">{r.shortURL}</a>
                  : <span style={{ color: 'red' }}>{r.error}</span>
                }
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ShortenForm;
