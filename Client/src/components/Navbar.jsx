import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/logo.png'


function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar">
    <img src={logo} alt="" />
      <h2 className='logo'>Trackify</h2>
      <div className="nav-buttons">
        <button onClick={() => navigate('/')}>🏠 Dashboard</button>
        <button onClick={() => navigate('/create')}>➕ Create Task</button>
        <button onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;
