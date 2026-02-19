const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const predictionRoutes = require('./routes/predictionRoutes');
const menuRoutes = require('./routes/menuRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const consumptionRoutes = require('./routes/consumptionRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const imageRoutes = require('./routes/imageRoutes');
const donationRoutes = require('./routes/donationRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is healthy' });
});

app.use('/api', predictionRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/consumption', consumptionRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', imageRoutes);
app.use('/api/donations', donationRoutes);

app.use(errorHandler);

module.exports = app;
