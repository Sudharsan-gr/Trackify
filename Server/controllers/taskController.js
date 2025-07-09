const db = require('../config/db');

// CREATE Task
exports.createTask = async (req, res) => {
  const { title, description, deadline, priority } = req.body;
  const userId = req.user.userId;

  try {
    const [result] = await db.promise().query(
      'INSERT INTO tasks (user_id, title, description, deadline, priority) VALUES (?, ?, ?, ?, ?)',
      [userId, title, description, deadline, priority]
    );
    res.status(201).json({ msg: 'Task created successfully', taskId: result.insertId });
  } catch (err) {
    res.status(500).json({ msg: 'Error creating task', error: err.message });
  }
};

// GET Tasks for Logged-in User
exports.getUserTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const [tasks] = await db.promise().query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching tasks', error: err.message });
  }
};

// GET Single Task by ID
exports.getTaskById = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    const [result] = await db.promise().query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching task', error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  const { title, description, status, priority, deadline } = req.body;
  const finalDeadline = deadline === '' ? null : deadline;

  try {
    const [result] = await db.promise().query(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, deadline = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND user_id = ?`,
      [title, description, status, priority, finalDeadline, taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    res.json({ msg: "Task updated successfully" });
  } catch (err) {
  console.error('Update Task Error:', err);  // Add this
  res.status(500).json({ msg: "Error updating task", error: err.message });
}

};


exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    const [result] = await db.promise().query(
      `DELETE FROM tasks WHERE id = ? AND user_id = ?`,
      [taskId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: "Task not found or not authorized" });
    }

    res.json({ msg: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting task", error: err.message });
  }
};
