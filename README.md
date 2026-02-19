# Smart Food Waste Prediction & Kitchen Management SaaS

## Project Structure

- backend/ - Node.js, Express, MongoDB API (MVC)
- frontend/ - React admin dashboard (Vite)

## Run Backend

1. cd backend
2. npm install
3. Copy .env.example to .env
4. npm run dev

## Run Frontend

1. cd frontend
2. npm install
3. Copy .env.example to .env
4. npm run dev

## Main APIs

- POST /api/predict-demand
- POST /api/check-expiry
- CRUD /api/menu
- CRUD /api/inventory
- POST /api/inventory/calculate-requirements
- POST /api/consumption
- GET /api/analytics/waste-dashboard
- GET /api/analytics/weekly-report
