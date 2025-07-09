import { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './taskform.css';

function CreateTask() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await API.post('/tasks', formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.msg || 'Task creation failed');
    }
  };

  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>➕ Create New Task</h2>
        {error && <p className="form-error">{error}</p>}

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
        />

        <div className="form-group">
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="form-group">
          <label>Priority:</label>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <label>Deadline:</label>
        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />

        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default CreateTask;
