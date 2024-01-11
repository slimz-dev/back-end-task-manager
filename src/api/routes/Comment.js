const express = require('express');
const router = express.Router();
const commentController = require('../controllers/Comment');
const tokenVerify = require('../middleware/tokenVerify');
// GET all users
router.get('/', commentController.getAllComment);

router.post('/:taskId', commentController.newComment);
router.delete('/', commentController.deleteAllComment);
module.exports = router;
