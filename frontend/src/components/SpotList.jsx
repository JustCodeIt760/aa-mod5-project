import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

function SpotList() {
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const fetchSpots = async () => {
      try {
        const response = await fetch('/api/spots');
        const data = await response.json();
        setSpots(data.Spots);
      } catch (error) {
        console.error('Error fetching spots:', error);
      }
    };

    fetchSpots();
  }, []);

  return (
    <div className="spot-list">
      {spots.map((spot) => (
        <Link to={`/spots/${spot.id}`} key={spot.id} className="spot-tile-link">
          <div className="spot-tile" title={spot.name}>
            <img src={spot.previewImage} alt={spot.name} className="thumbnail" />
            <h2>{spot.name}</h2>
            <p>{spot.city}, {spot.state}</p>
            <p>
              <span role="img" aria-label="star">⭐</span>
              {spot.avgRating !== null ? spot.avgRating.toFixed(1) : "New"}
            </p>
            <p>${spot.price} per night</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default SpotList;
