const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/Notification');
const tokenVerify = require('../middleware/tokenVerify');

router.get('/:userId', notificationController.getMyNotification);
router.post('/:userId', notificationController.changeStateNotification);
router.patch('/:userId', notificationController.deleteMyNotification);
router.get('/', notificationController.getAllNotifications);
router.delete('/', notificationController.deleteAllNotifications);

module.exports = router;
