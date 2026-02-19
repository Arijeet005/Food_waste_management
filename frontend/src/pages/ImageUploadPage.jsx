import React, { useState } from 'react';
import api from '../services/api';

function ImageUploadPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const submitImage = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    const res = await api.post('/check-expiry', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setResult(res.data.data);
  };

  return (
    <div>
      <h1>Image Expiry Detection</h1>
      <form className="card form-grid" onSubmit={submitImage}>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button type="submit">Check Expiry</button>
      </form>

      {result && (
        <div className="card">
          <h3>Result</h3>
          <p>Status: {result.status}</p>
          <p>Confidence: {result.confidence}</p>
          <p>File: {result.filename}</p>
        </div>
      )}
    </div>
  );
}

export default ImageUploadPage;
