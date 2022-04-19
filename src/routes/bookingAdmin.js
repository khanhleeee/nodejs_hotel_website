const express = require('express');
const router = express.Router();

const roomAdminController = require('../app/controllers/RoomAdminController');

router.get('/bookingRoom/:id', roomAdminController.confirm);
router.get('/bookingRoom', roomAdminController.showBooking)

module.exports = router;