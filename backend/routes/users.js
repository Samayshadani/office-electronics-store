const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setUserDefaultAddress,
  getAllUsers, // Admin
  getUserById, // Admin
  updateUser, // Admin
  deleteUser // Admin
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User specific routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/profile/addresses')
  .post(protect, addUserAddress);

router.route('/profile/addresses/:addressId')
  .put(protect, updateUserAddress)
  .delete(protect, deleteUserAddress);

router.route('/profile/addresses/:addressId/default')
  .put(protect, setUserDefaultAddress);

// Admin specific routes
router.route('/')
  .get(protect, authorize('admin'), getAllUsers);

router.route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

module.exports = router;