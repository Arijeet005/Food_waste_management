const Ingredient = require('../models/Ingredient');
const Dish = require('../models/Dish');

const reduceStockForCooking = async (kitchenId, dishId, cookedMeals) => {
  const dish = await Dish.findOne({ _id: dishId, kitchenId });
  if (!dish) {
    return;
  }

  const updates = dish.ingredients.map(async (item) => {
    const requiredAmount = item.amountPerMeal * cookedMeals;
    await Ingredient.findOneAndUpdate(
      { _id: item.ingredientId, kitchenId },
      { $inc: { stockQuantity: -requiredAmount } },
      { new: true }
    );
  });

  await Promise.all(updates);
};

module.exports = {
  reduceStockForCooking
};
