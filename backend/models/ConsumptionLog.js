const mongoose = require('mongoose');

const consumptionLogSchema = new mongoose.Schema(
  {
    kitchenId: {
      type: String,
      required: true,
      index: true
    },
    dishId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Dish',
      required: true
    },
    cooked: {
      type: Number,
      required: true,
      min: 0
    },
    consumed: {
      type: Number,
      required: true,
      min: 0
    },
    leftover: {
      type: Number,
      required: true,
      min: 0
    },
    date: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

consumptionLogSchema.index({ kitchenId: 1, date: 1 });

module.exports = mongoose.model('ConsumptionLog', consumptionLogSchema);
