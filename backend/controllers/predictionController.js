const EventAdjustment = require('../models/EventAdjustment');

const calculateBaseDemand = (pastConsumption, expectedPeople) => {
  const avgPast = pastConsumption.reduce((sum, v) => sum + v, 0) / pastConsumption.length;
  return (avgPast * 0.7) + (expectedPeople * 0.3);
};

const predictDemand = async (req, res, next) => {
  try {
    const {
      kitchenId,
      pastConsumption,
      dayOfWeek,
      expectedPeople,
      events = [],
      weather
    } = req.body;

    const eventRecords = await EventAdjustment.find({
      kitchenId,
      $or: [
        { name: { $in: events } },
        { holidayFlag: true }
      ]
    });

    const eventMultiplier = eventRecords.length
      ? eventRecords.reduce((acc, event) => acc * event.specialDemandMultiplier, 1)
      : 1;

    const weatherMultiplier = weather && weather.toLowerCase().includes('rain') ? 1.05 : 1;
    const predictedQuantity = Math.round(
      calculateBaseDemand(pastConsumption, expectedPeople) * eventMultiplier * weatherMultiplier
    );

    const surplusRisk = predictedQuantity > expectedPeople * 1.15;

    const mockMlPayload = {
      source: 'mock',
      externalModelUrl: process.env.ML_DEMAND_URL || 'http://localhost:5001/predict',
      modelIntegrationReady: true
    };

    return res.status(200).json({
      predictedQuantity,
      surplusRisk,
      donationRecommended: surplusRisk,
      adjustmentFactors: {
        eventMultiplier,
        weatherMultiplier,
        dayOfWeek
      },
      ml: mockMlPayload
    });
  } catch (error) {
    return next(error);
  }
};

const createEventAdjustment = async (req, res, next) => {
  try {
    const event = await EventAdjustment.create(req.body);
    return res.status(201).json({ success: true, data: event });
  } catch (error) {
    return next(error);
  }
};

const getEventAdjustments = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;
    const query = kitchenId ? { kitchenId } : {};
    const events = await EventAdjustment.find(query).sort({ date: 1 });
    return res.status(200).json({ success: true, data: events });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  predictDemand,
  createEventAdjustment,
  getEventAdjustments
};
