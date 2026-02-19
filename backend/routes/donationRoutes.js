const express = require('express');
const { body, query } = require('express-validator');
const {
  createNgo,
  getNgos,
  getNearbyNgos
} = require('../controllers/donationController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/ngos',
  [
    body('kitchenId').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('phone').isString().notEmpty(),
    body('address').isString().notEmpty(),
    body('location.type').equals('Point'),
    body('location.coordinates').isArray({ min: 2, max: 2 }),
    body('location.coordinates.*').isFloat(),
    body('acceptedFoodTypes').optional().isArray(),
    body('pickupAvailable').optional().isBoolean(),
    body('operatingHours').optional().isString()
  ],
  validateRequest,
  createNgo
);

router.get('/ngos', [query('kitchenId').optional().isString()], validateRequest, getNgos);

router.get(
  '/nearby-ngos',
  [
    query('lat').isFloat({ min: -90, max: 90 }),
    query('lng').isFloat({ min: -180, max: 180 }),
    query('radiusKm').optional().isFloat({ min: 0.1, max: 100 }),
    query('kitchenId').optional().isString()
  ],
  validateRequest,
  getNearbyNgos
);

module.exports = router;
