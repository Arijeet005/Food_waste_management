import React, { useEffect, useState } from 'react';
import api from '../services/api';

function InventoryPage() {
  const [kitchenId, setKitchenId] = useState('kitchen-nyc-001');
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', stockQuantity: '', unit: 'kg', reorderLevel: 0 });

  const loadInventory = async () => {
    const res = await api.get('/inventory', { params: { kitchenId } });
    setItems(res.data.data || []);
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    await api.post('/inventory', {
      kitchenId,
      name: form.name,
      stockQuantity: Number(form.stockQuantity),
      unit: form.unit,
      reorderLevel: Number(form.reorderLevel)
    });
    setForm({ name: '', stockQuantity: '', unit: 'kg', reorderLevel: 0 });
    loadInventory();
  };

  return (
    <div>
      <h1>Inventory Tracking</h1>
      <form className="card form-grid" onSubmit={onCreate}>
        <input value={kitchenId} onChange={(e) => setKitchenId(e.target.value)} placeholder="Kitchen ID" />
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ingredient Name" />
        <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} placeholder="Stock" />
        <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit" />
        <input type="number" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} placeholder="Low-stock alert at" />
        <button type="submit">Add Ingredient</button>
      </form>

      <div className="card">
        <h3>Inventory List</h3>
        {items.map((item) => (
          <div className="row" key={item._id}>
            <strong>{item.name}</strong>
            <span>{item.stockQuantity} {item.unit}</span>
            <span>{item.stockQuantity <= item.reorderLevel ? 'Low Stock' : 'Healthy'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventoryPage;
