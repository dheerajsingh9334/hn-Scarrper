import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Bookmarks from './pages/Bookmarks';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, loading } = useContext(AuthContext);

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/feed" element={<Home />} />
          <Route path="/login" element={
            loading ? <div className="loader"><div className="spinner"></div></div> :
            (!user ? <Login /> : <Navigate to="/feed" />)
          } />
          <Route path="/register" element={
            loading ? <div className="loader"><div className="spinner"></div></div> :
            (!user ? <Register /> : <Navigate to="/feed" />)
          } />
          <Route path="/bookmarks" element={
            loading ? <div className="loader"><div className="spinner"></div></div> :
            (user ? <Bookmarks /> : <Navigate to="/login" />)
          } />
        </Routes>
      </div>
    </>
  );
}

export default App;
