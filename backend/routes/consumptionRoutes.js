const express = require('express');
const { body, query } = require('express-validator');
const {
  createConsumptionLog,
  getConsumptionLogs
} = require('../controllers/consumptionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('kitchenId').isString().notEmpty(),
    body('dishId').isMongoId(),
    body('cooked').isFloat({ min: 0 }),
    body('consumed').isFloat({ min: 0 }),
    body('date').isISO8601()
  ],
  validateRequest,
  createConsumptionLog
);

router.get(
  '/',
  [
    query('kitchenId').optional().isString(),
    query('startDate').optional().isISO8601(),
    query('endDate').optional().isISO8601()
  ],
  validateRequest,
  getConsumptionLogs
);

module.exports = router;
