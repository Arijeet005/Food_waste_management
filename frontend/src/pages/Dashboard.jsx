import React, { useState } from 'react';
import api from '../services/api';

function Dashboard() {
  const [form, setForm] = useState({
    kitchenId: 'kitchen-nyc-001',
    pastConsumption: '120,130,115,140,125,132,138',
    dayOfWeek: 'Friday',
    expectedPeople: 145,
    events: 'Founders Day',
    weather: 'Rainy'
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitPrediction = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        kitchenId: form.kitchenId,
        pastConsumption: form.pastConsumption.split(',').map((n) => Number(n.trim())).filter((n) => !Number.isNaN(n)),
        dayOfWeek: form.dayOfWeek,
        expectedPeople: Number(form.expectedPeople),
        events: form.events ? form.events.split(',').map((x) => x.trim()) : [],
        weather: form.weather
      };

      const res = await api.post('/predict-demand', payload);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed');
    }
  };

  return (
    <div>
      <h1>Demand Prediction Dashboard</h1>
      <form className="card form-grid" onSubmit={submitPrediction}>
        <input name="kitchenId" value={form.kitchenId} onChange={onChange} placeholder="Kitchen ID" />
        <input name="pastConsumption" value={form.pastConsumption} onChange={onChange} placeholder="Past consumption CSV" />
        <input name="dayOfWeek" value={form.dayOfWeek} onChange={onChange} placeholder="Day of Week" />
        <input name="expectedPeople" value={form.expectedPeople} onChange={onChange} placeholder="Expected People" type="number" />
        <input name="events" value={form.events} onChange={onChange} placeholder="Events CSV" />
        <input name="weather" value={form.weather} onChange={onChange} placeholder="Weather" />
        <button type="submit">Predict Demand</button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="card">
          <h3>Prediction Result</h3>
          <p>Predicted Quantity: {result.predictedQuantity}</p>
          <p>Surplus Risk: {result.surplusRisk ? 'Yes' : 'No'}</p>
          <p>Donation Recommended: {result.donationRecommended ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
