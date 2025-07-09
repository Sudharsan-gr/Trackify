import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
      console.log(res.data); // inside fetchTasks()

    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      } else {
        setError('Failed to load tasks');
      }
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks(); // reload tasks
    } catch (err) {
      alert('Delete failed');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="dashboard">
      <h2>📋 Your Tasks</h2>
      {error && <p className="error">{error}</p>}

      <div className="task-list">
        {Array.isArray(tasks) && tasks.length === 0 ?  (
          <p>No tasks found. Go create some!</p>
        ) : (
          Array.isArray(tasks) && tasks.map(task => (

            <div key={task.id} className={`task-card ${task.status}`}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Deadline:</strong> {task.deadline}</p>
              <div className="task-actions">
                <button onClick={() => navigate(`/edit/${task.id}`)}>✏️ Edit</button>
                <button onClick={() => deleteTask(task.id)}>❌ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
