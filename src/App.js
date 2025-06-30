import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import Login from './Login';
import Register from './Register';
import './App.css';

function App() {
  // Get token from localStorage or empty string
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [isRegistering, setIsRegistering] = useState(false);

  // Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  // Logout function clears token
  const handleLogout = () => {
    setToken('');
  };

  if (!token) {
    // Show login or register forms if not logged in
    return (
      <div className="App">
        {isRegistering ? (
          <>
            <Register onRegister={() => setIsRegistering(false)} />
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsRegistering(false)}>Login</button>
            </p>
          </>
        ) : (
          <>
            <Login onLogin={setToken} />
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsRegistering(true)}>Register</button>
            </p>
          </>
        )}
      </div>
    );
  }

  // If logged in, show tasks with logout button
  return (
    <div className="App">
      <h1>Task Tracker</h1>
      <button onClick={handleLogout}>Logout</button>
      <TaskList token={token} />
    </div>
  );
}

export default App;
