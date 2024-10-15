import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // Import the star icon

function ManageSpots() {
  const [spots, setSpots] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserSpots = async () => {
      try {
        const response = await fetch('/api/spots/current');
        const data = await response.json();
        setSpots(data.Spots);
      } catch (error) {
        console.error('Error fetching user spots:', error);
      }
    };

    fetchUserSpots();
  }, []);

  const handleUpdate = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  const handleDelete = (spotId) => {
    // Logic to handle deleting the spot
    console.log(`Delete spot with ID: ${spotId}`);
  };

  return (
    <div className="manage-spots">
      <h1>Manage Spots</h1>
      {spots.length > 0 ? (
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
    </div>
  );
}

export default ManageSpots;
