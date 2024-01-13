const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/Calendar');
const tokenVerify = require('../middleware/tokenVerify');
// GET all users
router.get('/', calendarController.getAllCalendar);

router.get('/:userId', calendarController.getMyCalendar);
router.post('/:userId', calendarController.newCalendar);
router.patch('/:userId', calendarController.deleteCurrentCalendar);
router.delete('/', calendarController.deleteCalendar);

// router.post('/', commentController.deleteAllComment);
module.exports = router;
