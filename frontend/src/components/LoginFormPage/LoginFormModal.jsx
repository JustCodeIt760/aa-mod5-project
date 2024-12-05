import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    dispatch(sessionActions.login({ credential, password }))
      .then((response) => {
        if (response.ok) {
          closeModal();
        }
        if (response.status === 401) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
      })
  };

  const handleDemoLogin = (e) => {
    e.preventDefault();
      return dispatch(sessionActions.login({
      credential: 'Demo-lition',
      password: 'password'
    }))
      .then(closeModal);
  };

  // Disable button if credentials are too short
  const isDisabled = credential.length < 4 || password.length < 6;

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors.credential && (
          <p className="error-message above-input">{errors.credential}</p>
        )}
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className={errors.credential ? 'error-input' : ''}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={errors.credential ? 'error-input' : ''}
          />
        </label>
        <button type="submit" disabled={isDisabled}>Log In</button>
        <button type="button" onClick={handleDemoLogin} className="demo-button">
          Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
