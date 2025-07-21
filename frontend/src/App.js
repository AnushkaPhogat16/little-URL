import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Moon, Sun, Link2, BarChart3 } from 'lucide-react';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import './App.css';

const ThemeContext = createContext();
const AuthContext = createContext();

export const useTheme = () => useContext(ThemeContext);
export const useAuth = () => useContext(AuthContext);

function App() {
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState(localStorage.getItem('token') ? {token: localStorage.getItem('token')} : null);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({token});
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, login, logout}}>
      <ThemeContext.Provider value={{theme, toggleTheme}}>
        <div className={`app ${theme}`}>
          <BrowserRouter>
            <nav className="navbar">
              <Link to="/" className="logo">
                <div className="logo-icon">
                  <Link2 size={28} />
                </div>
                <span className="logo-text">LittleURL</span>
              </Link>
              <div className="nav-links">
                <Link to="/" className="nav-link">
                  <span>Home</span>
                </Link>
                <Link to="/dashboard" className="nav-link">
                  <BarChart3 size={18} />
                  <span>Dashboard</span>
                </Link>
                <button onClick={toggleTheme} className="theme-btn">
                  <div className="theme-icon">
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                  </div>
                </button>
                {user && (
                  <button onClick={logout} className="logout-btn">
                    <span>Logout</span>
                  </button>
                )}
              </div>
            </nav>
            
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
              </Routes>
            </main>
            
            <footer className="footer">
              <div className="footer-content">
                <div className="footer-brand">
                  <Link2 size={20} />
                  <span>LittleURL</span>
                </div>
                <p className="footer-text">
                  Fast, reliable URL shortening service
                </p>
              </div>
            </footer>
          </BrowserRouter>
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;