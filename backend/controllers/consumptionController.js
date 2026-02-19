const ConsumptionLog = require('../models/ConsumptionLog');
const { reduceStockForCooking } = require('../services/stockService');

const createConsumptionLog = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.leftover = payload.cooked - payload.consumed;

    if (payload.leftover < 0) {
      return res.status(400).json({ success: false, message: 'Consumed cannot exceed cooked quantity' });
    }

    const log = await ConsumptionLog.create(payload);
    await reduceStockForCooking(payload.kitchenId, payload.dishId, payload.cooked);

    return res.status(201).json({ success: true, data: log });
  } catch (error) {
    return next(error);
  }
};

const getConsumptionLogs = async (req, res, next) => {
  try {
    const { kitchenId, startDate, endDate } = req.query;
    const query = {};

    if (kitchenId) {
      query.kitchenId = kitchenId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await ConsumptionLog.find(query)
      .populate('dishId')
      .sort({ date: -1 });

    return res.status(200).json({ success: true, data: logs });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createConsumptionLog,
  getConsumptionLogs
};
