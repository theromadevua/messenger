import React, { useState } from 'react';
import AuthStore from '../store/AuthStore';
import { NavLink } from 'react-router-dom';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AuthStore.registration(email, username, password);
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="login__container">
        <div className="login__field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="login__field">
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="login__field">
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="login__actions">
          <NavLink to="/login" className="login__link">
            Login
          </NavLink>
          <button type="submit" className="login__button">
            Registration
          </button>
        </div>
      </form>
    </div>
  );
};

export default Registration;
