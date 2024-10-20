import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import the star icon
import ConfirmationModal from './ConfirmationModal'; // Ensure this path is correct
import './ConfirmationModal.css'; // Ensure this path is correct

// Define or import the getCsrfToken function
function getCsrfToken() {
  const name = 'XSRF-TOKEN=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookies = decodedCookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return '';
}

function ManageSpots() {
  const [spots, setSpots] = useState([]); // Initialize as an empty array
  const [showModal, setShowModal] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSpots = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/spots/current');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSpots(data.Spots || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserSpots();
  }, []);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDelete = (spotId) => {
    setSpotToDelete(spotId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const csrfToken = getCsrfToken(); // Get the CSRF token

    try {
      const response = await fetch(`/api/spots/${spotToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token in headers
        },
      });
      if (response.ok) {
        setSpots(spots.filter(spot => spot.id !== spotToDelete));
      } else {
      }
    } catch (error) {
    } finally {
      setShowModal(false);
      setSpotToDelete(null);
    }
  };

  if (isLoading) {
    return <div data-testid="user-spots">Loading...</div>;
  }

  if (error) {
    return <div data-testid="user-spots">Error: {error}</div>;
  }

  return (
    <div className="spot-list-container" data-testid="user-spots">
      <h1>Manage Spots</h1>
      {spots.length > 0 ? (
        <div className="spot-list">
          {spots.map((spot) => (
            <div key={spot.id} className="spot-tile" data-testid="spot-tile">
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
                  <p className="price" data-testid="spot-price">${spot.price} per night</p>
                </div>
              </Link>
              <div className="spot-actions">
                <button onClick={() => handleUpdate(spot.id)}>Update</button>
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
      {showModal && (
        <ConfirmationModal
          onClose={() => setShowModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

export default ManageSpots;
