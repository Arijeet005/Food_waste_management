const express = require('express');
const { body, param, query } = require('express-validator');
const {
  createDish,
  getDishes,
  getDishById,
  updateDish,
  deleteDish
} = require('../controllers/menuController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('kitchenId').isString().notEmpty(),
    body('name').isString().notEmpty(),
    body('ingredients').isArray({ min: 1 }),
    body('ingredients.*.ingredientId').isMongoId(),
    body('ingredients.*.name').isString().notEmpty(),
    body('ingredients.*.amountPerMeal').isFloat({ min: 0 }),
    body('ingredients.*.unit').isString().notEmpty(),
    body('quantityPerPerson').isFloat({ min: 0.1 })
  ],
  validateRequest,
  createDish
);

router.get('/', [query('kitchenId').optional().isString()], validateRequest, getDishes);
router.get('/:id', [param('id').isMongoId()], validateRequest, getDishById);
router.put('/:id', [param('id').isMongoId()], validateRequest, updateDish);
router.delete('/:id', [param('id').isMongoId()], validateRequest, deleteDish);

module.exports = router;
