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
                <Link2 size={24} />
                LittleURL
              </Link>
              <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <button onClick={toggleTheme} className="theme-btn">
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                {user && <button onClick={logout} className="logout-btn">Logout</button>}
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Login />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;