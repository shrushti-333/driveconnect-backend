const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  color: String,
  registrationNumber: { type: String, required: true, unique: true },
  mileage: { type: Number, required: true },
  fuelType: { type: String, enum: ['petrol', 'diesel', 'cng', 'hybrid'], required: true },
  features: [String],
  description: String,
  photos: [String],
  insuranceNumber: { type: String, required: true, unique: true },
  insuranceDocuments: [String],
  insuranceValidTill: { type: Date, required: true },
  insuranceVerified: { type: Boolean, default: false },
  pricePerHour: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  location: {
    city: String,
    address: String,
    coordinates: { type: { type: String, default: 'Point' }, coordinates: [Number] }
  },
  availableFrom: Date,
  status: { type: String, enum: ['pending', 'active', 'inactive'], default: 'pending' },
  averageRating: { type: Number, default: 5 },
  totalRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);