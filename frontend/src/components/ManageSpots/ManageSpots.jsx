import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { fetchUserSpots } from '../../store/spots';
import './ManageSpots.css';

function ManageSpots() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots.userSpots);
  const isLoading = useSelector(state => state.spots.isLoading);

  useEffect(() => {
    dispatch(fetchUserSpots());
  }, [dispatch]);

  if (isLoading) {
    return <div data-testid="user-spots">Loading...</div>;
  }

  return (
    <div className="manage-spots-container" data-testid="user-spots">
      <h1>Manage Spots</h1>
      {spots && spots.length > 0 ? (
        <div className="spot-list">
          {spots.map((spot) => (
            <div key={spot.id} className="spot-tile" data-testid="spot-tile">
              <Link to={`/spots/${spot.id}`} className="spot-tile-link" data-testid="spot-link">
                <img src={spot.previewImage} alt={spot.name} className="thumbnail" data-testid="spot-thumbnail-image" />
                <div className="spot-info">
                  <p data-testid="spot-city">{spot.city}, {spot.state}</p>
                  <div className="rating">
                    <FaStar />
                    <span data-testid="spot-rating">{spot.avgRating !== null ? Number(spot.avgRating).toFixed(1) : "New"}</span>
                  </div>
                </div>
                <p className="price" data-testid="spot-price">${spot.price} / night</p>
              </Link>
              <div className="spot-actions">
                <Link to={`/spots/${spot.id}/edit`}>
                  <button>Update</button>
                </Link>
                <button onClick={() => handleDelete(spot.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>You have not created any spots yet.</p>
          <Link to="/spots/new">
            <button>Create a New Spot</button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ManageSpots;
