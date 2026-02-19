const mongoose = require('mongoose');

const dishIngredientSchema = new mongoose.Schema(
  {
    ingredientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ingredient',
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    amountPerMeal: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      required: true,
      trim: true
    }
  },
  { _id: false }
);

const dishSchema = new mongoose.Schema(
  {
    kitchenId: {
      type: String,
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    ingredients: {
      type: [dishIngredientSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'Dish must have at least one ingredient'
      }
    },
    quantityPerPerson: {
      type: Number,
      required: true,
      min: 0.1
    }
  },
  {
    timestamps: true
  }
);

dishSchema.index({ kitchenId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Dish', dishSchema);
