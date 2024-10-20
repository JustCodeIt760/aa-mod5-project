import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  const location = useLocation();

  return (
    <ul>
      <li>
        <NavLink to="/" data-testid="logo">Home</NavLink>
      </li>
      {isLoaded && (
        <React.Fragment>
          <li className="navbar-icon">
            <img src="/favicon.ico" alt="Favicon" className="navbar-favicon" />
          </li>
          <li className="navbar-title">
            <h1>Airbnb Clone</h1>
          </li>
          <div className="right-nav">
            {sessionUser && location.pathname !== '/' && (
              <li>
                <NavLink to="/spots/new">Create a New Spot</NavLink>
              </li>
            )}
            <li className="profile-button">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        </React.Fragment>
      )}
    </ul>
  );
}

export default Navigation;
