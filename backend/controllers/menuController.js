const Dish = require('../models/Dish');

const createDish = async (req, res, next) => {
  try {
    const dish = await Dish.create(req.body);
    return res.status(201).json({ success: true, data: dish });
  } catch (error) {
    return next(error);
  }
};

const getDishes = async (req, res, next) => {
  try {
    const { kitchenId } = req.query;
    const dishes = await Dish.find(kitchenId ? { kitchenId } : {}).populate('ingredients.ingredientId');
    return res.status(200).json({ success: true, data: dishes });
  } catch (error) {
    return next(error);
  }
};

const getDishById = async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('ingredients.ingredientId');
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    return res.status(200).json({ success: true, data: dish });
  } catch (error) {
    return next(error);
  }
};

const updateDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    return res.status(200).json({ success: true, data: dish });
  } catch (error) {
    return next(error);
  }
};

const deleteDish = async (req, res, next) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }
    return res.status(200).json({ success: true, message: 'Dish deleted' });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createDish,
  getDishes,
  getDishById,
  updateDish,
  deleteDish
};
