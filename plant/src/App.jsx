import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import WateringCalendar from './pages/WateringCalendar';
import axios from 'axios';
import { toast } from 'react-toastify';

function App() {
  const [activeTab, setActiveTab]         = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn]       = useState(false);
  const [isRegister, setIsRegister]       = useState(false);
  const [username, setUsername]           = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [plants, setPlants]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [authLoading, setAuthLoading]     = useState(false);
  const [pageTransition, setPageTransition] = useState(false);
  const [loggedInUser, setLoggedInUser]   = useState('');

  // Preloader — 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Check localStorage — already logged in-a?
  useEffect(() => {
    const token = localStorage.getItem('leafyToken');
    const savedUser = localStorage.getItem('leafyUser');
    if (token && savedUser) {
      setIsLoggedIn(true);
      setLoggedInUser(savedUser);
    }
  }, []);

  // Fetch plants after login — token attach pannuvom
  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem('leafyToken');
        const response = await axios.get('http://localhost:5000/api/plants/all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const formattedPlants = response.data.map(plant => ({
          ...plant,
          id: plant._id,
          statusClass: plant.waterStatus.includes("Thirsty") ? "text-danger fw-bold" : "text-success"
        }));
        setPlants(formattedPlants);
      } catch (error) {
        toast.error("Failed to load plants. Please login again.");
        handleLogout();
      }
    };
    fetchPlants();
  }, [isLoggedIn]);

  // Smooth tab switch
  const handleTabChange = (tab) => {
    setPageTransition(true);
    setTimeout(() => {
      setActiveTab(tab);
      setPageTransition(false);
    }, 200);
  };

  // REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username, email, password
      });
      if (response.data.success) {
        toast.success("Account created! Please login.");
        setIsRegister(false);
        setUsername(''); setEmail(''); setPassword('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed. Try again!");
    } finally {
      setAuthLoading(false);
    }
  };

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email, password
      });
      if (response.data.success) {
        // Save token + username to localStorage
        localStorage.setItem('leafyToken', response.data.token);
        localStorage.setItem('leafyUser', response.data.username);
        setLoggedInUser(response.data.username);
        setIsLoggedIn(true);
        toast.success(`Welcome back, ${response.data.username}!`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check your credentials!");
    } finally {
      setAuthLoading(false);
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('leafyToken');
    localStorage.removeItem('leafyUser');
    setIsLoggedIn(false);
    setPlants([]);
    setLoggedInUser('');
    toast.success("Logged out successfully!");
  };

  // Preloader
  if (loading) {
    return (
      <div className="preloader">
        <div className="preloader-icon">
          <i className="fa-solid fa-seedling"></i>
        </div>
        <p className="preloader-brand">LeafyLife</p>
        <p className="preloader-text">PREMIUM GREENHOUSE SUITE</p>
        <div className="preloader-bar">
          <div className="preloader-bar-fill"></div>
        </div>
      </div>
    );
  }

  // Auth Screen — Login / Register
  if (!isLoggedIn) {
    return (
      <div className="auth-container">
        <div className="auth-card">

          <div className="text-center mb-4">
            <div className="auth-logo">
              <i className="fa-solid fa-seedling"></i>
            </div>
            <h2 className="auth-title m-0">LeafyLife</h2>
            <p className="auth-subtitle">PREMIUM GREENHOUSE SUITE</p>
          </div>

          {/* TAB SWITCH — Login / Register */}
          <div className="auth-tabs mb-4">
            <button
              className={`auth-tab ${!isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(false)}
            >
              <i className="fa-solid fa-right-to-bracket me-2"></i>Login
            </button>
            <button
              className={`auth-tab ${isRegister ? 'active' : ''}`}
              onClick={() => setIsRegister(true)}
            >
              <i className="fa-solid fa-user-plus me-2"></i>Register
            </button>
          </div>

          {/* REGISTER FORM */}
          {isRegister ? (
            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="auth-label">
                  <i className="fa-solid fa-user me-2"></i>USERNAME
                </label>
                <input
                  type="text"
                  className="form-control auth-input"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="auth-label">
                  <i className="fa-solid fa-envelope me-2"></i>EMAIL
                </label>
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="auth-label">
                  <i className="fa-solid fa-lock me-2"></i>PASSWORD
                </label>
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={authLoading}>
                {authLoading
                  ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Creating Account...</>
                  : <><i className="fa-solid fa-user-plus me-2"></i>Create Account</>
                }
              </button>
            </form>
          ) : (
            /* LOGIN FORM */
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="auth-label">
                  <i className="fa-solid fa-envelope me-2"></i>EMAIL
                </label>
                <input
                  type="email"
                  className="form-control auth-input"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="auth-label">
                  <i className="fa-solid fa-lock me-2"></i>PASSWORD
                </label>
                <input
                  type="password"
                  className="form-control auth-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="auth-btn" disabled={authLoading}>
                {authLoading
                  ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Logging in...</>
                  : <><i className="fa-solid fa-right-to-bracket me-2"></i>Login</>
                }
              </button>
            </form>
          )}

          <p className="auth-version">
            <i className="fa-solid fa-shield-halved me-1"></i>LEAFYLIFE SECURE v1.4.2
          </p>
        </div>
      </div>
    );
  }

  // Main App
  return (
    <div className="container-fluid p-0 vh-100 d-flex flex-column">

      {/* HEADER */}
      <header className="app-header d-flex justify-content-between align-items-center w-100 position-sticky top-0 z-3">
        <div className="d-flex align-items-center gap-2">
          <i className="fa-solid fa-seedling header-icon animate-float"></i>
          <h4 className="fw-bold m-0 header-brand">LeafyLife Premium</h4>
        </div>
        <div className="d-flex align-items-center gap-3">
          <span className="badge bg-success-subtle text-success p-2 rounded-pill px-3" style={{ fontSize: '0.78rem' }}>
            <i className="fa-solid fa-circle-dot text-success me-1"></i>
            {loggedInUser}
          </span>
          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={handleLogout}>
            <i className="fa-solid fa-power-off me-1"></i>Logout
          </button>
        </div>
      </header>

      {/* BODY */}
      <div className="row g-0 flex-grow-1 overflow-hidden" style={{ minHeight: "calc(100vh - 57px)" }}>
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

        <div
          className="col-12 col-md-9 d-flex flex-column h-100 overflow-auto bg-light"
          style={{
            opacity: pageTransition ? 0 : 1,
            transform: pageTransition ? 'translateY(8px)' : 'translateY(0)',
            transition: 'opacity 0.2s ease, transform 0.2s ease'
          }}
        >
          {activeTab === 'dashboard' ? (
            <Dashboard plants={plants} setPlants={setPlants} />
          ) : (
            <WateringCalendar plants={plants} setPlants={setPlants} />
          )}

          <footer className="app-footer mt-auto">
            <p className="m-0">
              <i className="fa-solid fa-seedling me-2 text-success opacity-50"></i>
              2026 LeafyLife Architecture · Powered by Premium Cloud MongoDB Engine
            </p>
          </footer>
        </div>
      </div>

    </div>
  );
}

export default App;