const express = require('express');
const router = express.Router();
const { createTask, getUserTasks ,updateTask , deleteTask,getTaskById} = require('../controllers/taskController');
const authenticate = require('../middleware/authMiddleware');

router.post('/', authenticate, createTask);      // Create Task
router.get('/', authenticate, getUserTasks);   // Get Tasks for user
router.put('/:id', authenticate, updateTask);   // Update task
router.delete('/:id', authenticate, deleteTask);
router.get('/:id', authenticate, getTaskById); // ⬅️ This must be AFTER `router.get('/')`



module.exports = router;
