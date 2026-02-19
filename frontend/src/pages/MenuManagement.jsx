import React, { useEffect, useState } from 'react';
import api from '../services/api';

function MenuManagement() {
  const [kitchenId, setKitchenId] = useState('kitchen-nyc-001');
  const [dishes, setDishes] = useState([]);
  const [form, setForm] = useState({
    name: '',
    ingredientId: '',
    ingredientName: '',
    amountPerMeal: '',
    unit: 'kg',
    quantityPerPerson: 1
  });

  const loadDishes = async () => {
    const res = await api.get('/menu', { params: { kitchenId } });
    setDishes(res.data.data || []);
  };

  useEffect(() => {
    loadDishes();
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    await api.post('/menu', {
      kitchenId,
      name: form.name,
      ingredients: [
        {
          ingredientId: form.ingredientId,
          name: form.ingredientName,
          amountPerMeal: Number(form.amountPerMeal),
          unit: form.unit
        }
      ],
      quantityPerPerson: Number(form.quantityPerPerson)
    });
    setForm({ name: '', ingredientId: '', ingredientName: '', amountPerMeal: '', unit: 'kg', quantityPerPerson: 1 });
    loadDishes();
  };

  return (
    <div>
      <h1>Menu Management</h1>
      <form className="card form-grid" onSubmit={onCreate}>
        <input value={kitchenId} onChange={(e) => setKitchenId(e.target.value)} placeholder="Kitchen ID" />
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dish Name" />
        <input value={form.ingredientId} onChange={(e) => setForm({ ...form, ingredientId: e.target.value })} placeholder="Ingredient ID" />
        <input value={form.ingredientName} onChange={(e) => setForm({ ...form, ingredientName: e.target.value })} placeholder="Ingredient Name" />
        <input type="number" value={form.amountPerMeal} onChange={(e) => setForm({ ...form, amountPerMeal: e.target.value })} placeholder="Amount per Meal" />
        <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="Unit" />
        <input type="number" value={form.quantityPerPerson} onChange={(e) => setForm({ ...form, quantityPerPerson: e.target.value })} placeholder="Quantity per Person" />
        <button type="submit">Add Dish</button>
      </form>

      <div className="card">
        <h3>Dish List</h3>
        {dishes.map((dish) => (
          <div key={dish._id} className="row">
            <strong>{dish.name}</strong>
            <span>QPP: {dish.quantityPerPerson}</span>
            <span>Ingredients: {dish.ingredients.length}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuManagement;
