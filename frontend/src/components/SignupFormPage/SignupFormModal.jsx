import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Invalid email";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email";
    }

    if (!username) {
      newErrors.username = "Username is required";
    }

    if (!firstName) {
      newErrors.firstName = "First Name is required";
    }

    if (!lastName) {
      newErrors.lastName = "Last Name is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Confirm Password field must be the same as the Password field' });
      return;
    }

    setErrors({});
    dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then((response) => {
        if (response.ok) {
          closeModal();
        }
        if (response.status === 401) {
          setErrors({ credential: "The provided credentials were invalid" });
        }
        if (response.status === 500) {
          setErrors({
            username: 'User with that username already exists',
            email: 'User with that email already exists'
          });
        }
      });
  };

  const isDisabled =
    !firstName ||
    !lastName ||
    !email ||
    username.length < 4 ||
    password.length < 6 ||
    !confirmPassword;

  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
            className={errors.firstName ? 'error-input' : ''}
          />
          {errors.firstName && (
            <p className="error-message">{errors.firstName}</p>
          )}
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
            className={errors.lastName ? 'error-input' : ''}
          />
          {errors.lastName && (
            <p className="error-message">{errors.lastName}</p>
          )}
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
            className={errors.email ? 'error-input' : ''}
          />
          {errors.email && (
            <p className="error-message">{errors.email}</p>
          )}
        </label>
        <label>
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && (
            <p className="error-message">{errors.username}</p>
          )}
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && (
            <p className="error-message">{errors.password}</p>
          )}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            className={errors.confirmPassword ? 'error-input' : ''}
          />
          {errors.confirmPassword && (
            <p className="error-message">{errors.confirmPassword}</p>
          )}
        </label>
        <button type="submit" disabled={isDisabled}>Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;