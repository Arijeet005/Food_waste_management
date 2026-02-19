import React, { useEffect, useState } from 'react';
import api from '../services/api';

function ConsumptionForm() {
  const [kitchenId, setKitchenId] = useState('kitchen-nyc-001');
  const [dishId, setDishId] = useState('');
  const [cooked, setCooked] = useState('');
  const [consumed, setConsumed] = useState('');
  const [date, setDate] = useState('');
  const [dishes, setDishes] = useState([]);
  const [logs, setLogs] = useState([]);

  const load = async () => {
    const [dishRes, logRes] = await Promise.all([
      api.get('/menu', { params: { kitchenId } }),
      api.get('/consumption', { params: { kitchenId } })
    ]);
    setDishes(dishRes.data.data || []);
    setLogs(logRes.data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submitLog = async (e) => {
    e.preventDefault();
    await api.post('/consumption', {
      kitchenId,
      dishId,
      cooked: Number(cooked),
      consumed: Number(consumed),
      date
    });
    setCooked('');
    setConsumed('');
    setDate('');
    load();
  };

  return (
    <div>
      <h1>Daily Consumption Entry</h1>
      <form className="card form-grid" onSubmit={submitLog}>
        <input value={kitchenId} onChange={(e) => setKitchenId(e.target.value)} placeholder="Kitchen ID" />
        <select value={dishId} onChange={(e) => setDishId(e.target.value)}>
          <option value="">Select Dish</option>
          {dishes.map((dish) => (
            <option key={dish._id} value={dish._id}>{dish.name}</option>
          ))}
        </select>
        <input type="number" value={cooked} onChange={(e) => setCooked(e.target.value)} placeholder="Cooked" />
        <input type="number" value={consumed} onChange={(e) => setConsumed(e.target.value)} placeholder="Consumed" />
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button type="submit">Save Log</button>
      </form>

      <div className="card">
        <h3>Recent Logs</h3>
        {logs.map((log) => (
          <div className="row" key={log._id}>
            <strong>{log.dishId?.name || 'Dish'}</strong>
            <span>Cooked: {log.cooked}</span>
            <span>Consumed: {log.consumed}</span>
            <span>Leftover: {log.leftover}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsumptionForm;
