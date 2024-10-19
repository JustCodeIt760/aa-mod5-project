import React from 'react';
import { useSelector } from 'react-redux';

function ManageSpots() {
  const userSpots = useSelector(state => state.spots.userSpots); // Adjust this based on your actual state structure

  return (
    <div data-testid="user-spots">
      <h1>Manage Spots</h1>
      {userSpots && userSpots.length > 0 ? (
        <ul>
          {userSpots.map(spot => (
            <li key={spot.id}>{spot.name}</li> // Adjust based on your spot data structure
          ))}
        </ul>
      ) : (
        <p>You have no spots yet.</p>
      )}
    </div>
  );
}

export default ManageSpots;
