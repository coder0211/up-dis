'use strict';
const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/imagesController');

router.route('/')
	.get(taskController.listTasks)
	.post(taskController.createTask);

module.exports = router;