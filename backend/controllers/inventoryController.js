const Ingredient = require('../models/Ingredient');
const Dish = require('../models/Dish');

const createIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    return res.status(201).json({ success: true, data: ingredient });
  } catch (error) {
    return next(error);
  }
};

const getIngredients = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;
    const ingredients = await Ingredient.find(kitchenId ? { kitchenId } : {}).sort({ name: 1 });
    return res.status(200).json({ success: true, data: ingredients });
  } catch (error) {
    return next(error);
  }
};

const updateIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!ingredient) {
      return res.status(404).json({ success: false, message: 'Ingredient not found' });
    }
    return res.status(200).json({ success: true, data: ingredient });
  } catch (error) {
    return next(error);
  }
};

const deleteIngredient = async (req, res, next) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ success: false, message: 'Ingredient not found' });
    }
    return res.status(200).json({ success: true, message: 'Ingredient deleted' });
  } catch (error) {
    return next(error);
  }
};

const calculateRequirements = async (req, res, next) => {
  try {
    const { kitchenId, predictedMeals, dishes } = req.body;

    const dishDocs = await Dish.find({ _id: { $in: dishes }, kitchenId });
    const neededMap = new Map();

    dishDocs.forEach((dish) => {
      dish.ingredients.forEach((ingredient) => {
        const current = neededMap.get(String(ingredient.ingredientId)) || {
          ingredientId: ingredient.ingredientId,
          name: ingredient.name,
          unit: ingredient.unit,
          required: 0
        };
        current.required += ingredient.amountPerMeal * predictedMeals;
        neededMap.set(String(ingredient.ingredientId), current);
      });
    });

    const ingredientIds = Array.from(neededMap.values()).map((item) => item.ingredientId);
    const stocks = await Ingredient.find({ _id: { $in: ingredientIds }, kitchenId });

    const stockMap = new Map(stocks.map((stock) => [String(stock._id), stock]));
    const requirements = Array.from(neededMap.values()).map((item) => {
      const stockItem = stockMap.get(String(item.ingredientId));
      const stockQuantity = stockItem ? stockItem.stockQuantity : 0;
      const shortage = Math.max(0, item.required - stockQuantity);
      return {
        ingredientId: item.ingredientId,
        name: item.name,
        unit: item.unit,
        required: Number(item.required.toFixed(2)),
        stockQuantity,
        shortage,
        shortageAlert: shortage > 0
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        kitchenId,
        predictedMeals,
        requirements
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createIngredient,
  getIngredients,
  updateIngredient,
  deleteIngredient,
  calculateRequirements
};
