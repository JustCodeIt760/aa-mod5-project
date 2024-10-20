import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa'; // Import the star icon
import { Link, useLocation } from 'react-router-dom'; // Import Link from react-router-dom
import { useSelector } from 'react-redux';
import './SpotList.css';

function SpotList() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/spots');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (Array.isArray(data.Spots)) {
          setSpots(data.Spots);
        } else {
          throw new Error('Data format is incorrect');
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpots();
  }, []);

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">Error: {error}</div>;
  }

  if (spots.length === 0) {
    return <div data-testid="no-spots">No spots available</div>;
  }

  return (
    <div className="spot-list-container">
      {location.pathname === '/' && sessionUser && (
        <Link to="/spots/new" className="create-spot-link">
          <button data-testid="create-new-spot-button">Create a New Spot</button>
        </Link>
      )}
      <div className="spot-list" data-testid="spots-list">
        {spots.map((spot) => (
          <div key={spot.id} data-testid="spot-tile">
            <Link to={`/spots/${spot.id}`} className="spot-tile-link" data-testid="spot-link">
              <div className="spot-tile-content" title={spot.name} data-testid="spot-tooltip">
                <img src={spot.previewImage} alt={spot.name} className="thumbnail" data-testid="spot-thumbnail-image" />
                <div className="spot-info">
                  <p data-testid="spot-city">{spot.city}, {spot.state}</p>
                  <div className="rating">
                    <FaStar />
                    <span data-testid="spot-rating">{spot.avgRating !== null ? Number(spot.avgRating).toFixed(1) : "New"}</span>
                  </div>
                </div>
                <p className="price" data-testid="spot-price">${spot.price} / night</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotList;
