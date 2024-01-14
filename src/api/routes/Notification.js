const express = require('express');
const router = express.Router();
const notificationSchema = require('../controllers/Notification');
const tokenVerify = require('../middleware/tokenVerify');
// GET all users
router.get('/', notificationSchema.getAllCalendar);

router.get('/:userId', notificationSchema.getMyCalendar);
router.post('/:userId', notificationSchema.newCalendar);
router.patch('/:userId', notificationSchema.deleteCurrentCalendar);
router.delete('/', notificationSchema.deleteCalendar);

module.exports = router;
