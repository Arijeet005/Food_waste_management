const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema(
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
    contactPerson: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    },
    acceptedFoodTypes: {
      type: [String],
      default: []
    },
    pickupAvailable: {
      type: Boolean,
      default: true
    },
    operatingHours: {
      type: String,
      default: '09:00 - 18:00'
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: (arr) => Array.isArray(arr) && arr.length === 2,
          message: 'Coordinates must be [longitude, latitude]'
        }
      }
    }
  },
  {
    timestamps: true
  }
);

ngoSchema.index({ location: '2dsphere' });
ngoSchema.index({ kitchenId: 1, name: 1 });

module.exports = mongoose.model('Ngo', ngoSchema);
