const mongoose = require('mongoose');

const eventAdjustmentSchema = new mongoose.Schema(
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
    date: {
      type: Date,
      required: true
    },
    holidayFlag: {
      type: Boolean,
      default: false
    },
    specialDemandMultiplier: {
      type: Number,
      required: true,
      min: 0.1,
      max: 5,
      default: 1
    },
    notes: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

eventAdjustmentSchema.index({ kitchenId: 1, date: 1 });

module.exports = mongoose.model('EventAdjustment', eventAdjustmentSchema);
