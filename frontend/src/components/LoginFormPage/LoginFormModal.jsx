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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      } else if (data && data.message) {
        setErrors({ credential: data.message });
      }
    }
  };

  const handleDemoLogin = () => {
    return dispatch(sessionActions.login({ credential: "demo@user.io", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.message) setErrors({ message: data.message });
      });
  };

  return (
    <div data-testid="login-modal">
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            data-testid="credential-input"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            data-testid="password-input"
          />
        </label>
        {errors.credential && <p data-testid="login-error">{errors.credential}</p>}
        {errors.message && <p data-testid="login-error">{errors.message}</p>}
        <button
          type="submit"
          disabled={credential.length < 4 || password.length < 6}
          data-testid="login-button"
        >
          Log In
        </button>
        <button type="button" onClick={handleDemoLogin} data-testid="demo-user-login">
          Log in as Demo User
        </button>
      </form>
    </div>
  );
}

export default LoginFormModal;
