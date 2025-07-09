import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import './taskform.css';

function EditTask() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    deadline: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/tasks/${id}`);
        setFormData(res.data); // Assuming backend returns {id, title, ...}
      } catch (err) {
        setError('Failed to load task');
      }
    };
    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  const formattedDeadline = formData.deadline
    ? formData.deadline.slice(0, 10) // Extract YYYY-MM-DD from full ISO
    : null;

  const cleanedData = {
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority,
    deadline: formattedDeadline
  };

  try {
    await API.put(`/tasks/${id}`, cleanedData);
    navigate('/');
  } catch (err) {
    console.error("Update failed:", err);
    setError('Update failed');
  }
};




  return (
    <div className="task-form-container">
      <form onSubmit={handleSubmit} className="task-form">
        <h2>✏️ Edit Task</h2>
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
          value={formData.deadline ? formData.deadline.slice(0, 10) : ''}
          onChange={handleChange}
        />

        <button type="submit">Update Task</button>
      </form>
    </div>
  );
}

export default EditTask;
