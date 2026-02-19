const express = require('express');
const { body, query } = require('express-validator');
const {
  predictDemand,
  createEventAdjustment,
  getEventAdjustments
} = require('../controllers/predictionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/predict-demand',
  [
    body('kitchenId').isString().notEmpty(),
    body('pastConsumption').isArray({ min: 3 }),
    body('pastConsumption.*').isNumeric(),
    body('dayOfWeek').isString().notEmpty(),
    body('expectedPeople').isInt({ min: 1 }),
    body('events').optional().isArray(),
    body('weather').optional().isString()
  ],
  validateRequest,
  predictDemand
);

router.post(
  '/events',
  [
    body('kitchenId').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('date').isISO8601(),
    body('holidayFlag').optional().isBoolean(),
    body('specialDemandMultiplier').isFloat({ min: 0.1, max: 5 })
  ],
  validateRequest,
  createEventAdjustment
);

router.get(
  '/events',
  [query('kitchenId').optional().isString()],
  validateRequest,
  getEventAdjustments
);

module.exports = router;
