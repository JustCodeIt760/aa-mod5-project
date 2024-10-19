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
  const [spots, setSpots] = useState(null);
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
        console.log('Fetched spots:', data);
        setSpots(data.Spots || []);
      } catch (error) {
        console.error('Error fetching user spots:', error);
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
    console.log(`Attempting to delete spot with ID: ${spotId}`); // Debugging line
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
        console.log(`Spot with ID: ${spotToDelete} deleted successfully`); // Debugging line
        setSpots(spots.filter(spot => spot.id !== spotToDelete));
      } else {
        console.error('Failed to delete spot');
      }
    } catch (error) {
      console.error('Error deleting spot:', error);
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
    <div className="manage-spots" data-testid="user-spots">
      <h1>Manage Spots</h1>
      {spots && spots.length > 0 ? (
        spots.map((spot) => (
          <div key={spot.id} className="spot-tile">
            <Link to={`/spots/${spot.id}`} className="spot-tile-link">
              <img src={spot.previewImage} alt={spot.name} className="thumbnail" />
              <div className="spot-info">
                <h2>{spot.name}</h2>
                <p>{spot.city}, {spot.state}</p>
                <div className="rating">
                  <FaStar /> {/* Star icon */}
                  <span>{spot.avgRating !== null ? Number(spot.avgRating).toFixed(1) : "New"}</span>
                </div>
              </div>
              <p className="price">${spot.price} per night</p>
            </Link>
            <div className="spot-actions">
              <button onClick={() => handleUpdate(spot.id)}>Update</button>
              <button onClick={() => handleDelete(spot.id)}>Delete</button>
            </div>
          </div>
        ))
      ) : (
        <div>
          <p>You have not created any spots yet.</p>
          <Link to="/spots/new">Create a New Spot</Link>
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
