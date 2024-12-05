import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const [spots, setSpots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSpots() {
      try {
        const response = await fetch('/api/spots');
        if (response.ok) {
          const data = await response.json();
          setSpots(data.Spots);
        } else {
          console.error('Failed to fetch spots');
        }
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchSpots();
  }, []);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="landing-page">
      <div className="spots-grid">
        {spots.map(spot => (
          <div
            key={spot.id}
            className="spot-card"
            onClick={() => handleSpotClick(spot.id)}
            role="button"
            tabIndex={0}
            title={spot.name}
          >
            <img
              src={spot.previewImage}
              alt={spot.name}
              className="spot-image"
              onError={(e) => {
                e.target.src = 'https://plus.unsplash.com/premium_photo-1661915661139-5b6a4e4a6fcc?q=80&w=967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
              }}
            />
            <div className="spot-info">
              <div className="spot-location">{spot.city}, {spot.state}</div>
              <div className="spot-rating">
                ★ {spot.avgRating ? Number(spot.avgRating).toFixed(1) : 'New'}
              </div>
              <div className="spot-price">
                <span className="price">${spot.price}</span> night
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;