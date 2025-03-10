import React, { useState } from 'react';
import { observer } from 'mobx-react';
import AuthStore from '../store/AuthStore';
import { NavLink } from 'react-router-dom';

const Login = observer(() => {
  const [email, setEmail] = useState('gogi@gogi.com');
  const [password, setPassword] = useState('12345');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await AuthStore.login(email, password);
  };

  return (
    <div  className="login">
      <form onSubmit={handleSubmit} className="login__container">
        <div className="login__field">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <NavLink to="/registration" className="login__link">Registration</NavLink>
          <button type="submit" className="login__button">Login</button>
        </div>
      </form>
    </div>
  );
});

export default Login;
