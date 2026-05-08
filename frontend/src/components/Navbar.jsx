import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Bookmark, User, Terminal } from 'lucide-react';

const Navbar = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Terminal size={24} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
        HN Scraper
      </Link>
      <div className="navbar-links">
        <Link to="/feed" className="nav-link">Feed</Link>
        {loading ? (
          <span className="nav-link" style={{ opacity: 0.5 }}>Connecting...</span>
        ) : user ? (
          <>
            <span className="nav-link" style={{ cursor: 'default' }}>
              <User size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {user.username}
            </span>
            <Link to="/bookmarks" className="nav-link">
              <Bookmark size={18} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              Bookmarks
            </Link>
            <button onClick={handleLogout} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
