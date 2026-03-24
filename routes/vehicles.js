const express = require('express');
const { registerVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect, isOwner } = require('../middleware/auth');

const router = express.Router();

router.get('/', getVehicles);
router.get('/:id', getVehicleById);
router.post('/', protect, isOwner, registerVehicle);
router.put('/:id', protect, isOwner, updateVehicle);
router.delete('/:id', protect, isOwner, deleteVehicle);

module.exports = router;