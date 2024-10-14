import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for authentication

function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const currentUser = useSelector((state) => state.session.user); // Get the current user from Redux state

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const response = await fetch(`/api/spots/${id}`);
        const data = await response.json();
        setSpot(data);
      } catch (error) {
        console.error('Error fetching spot details:', error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/spots/${id}/reviews`);
        const data = await response.json();
        const sortedReviews = data.Reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setReviews(sortedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchSpotDetails();
    fetchReviews();
  }, [id]);

  if (!spot) return <div>Loading...</div>;

  const avgRating = reviews.length
    ? (reviews.reduce((acc, review) => acc + review.stars, 0) / reviews.length).toFixed(1)
    : "New";
  const reviewCount = reviews.length;

  const isOwner = currentUser && currentUser.id === spot.ownerId;

  return (
    <div className="spot-detail">
      <div className="callout-info-box">
        <h2>{spot.name}</h2>
        <p>{spot.city}, {spot.state}</p>
        <p>
          <span role="img" aria-label="star">⭐</span>
          {avgRating} {reviewCount > 0 && `· ${reviewCount} ${reviewCount === 1 ? 'Review' : 'Reviews'}`}
        </p>
        <p>${spot.price} per night</p>
      </div>

      <div className="spot-images">
        {spot.SpotImages && spot.SpotImages.map((image) => (
          <img key={image.id} src={image.url} alt={`Spot ${spot.id}`} className="spot-image" />
        ))}
      </div>

      <div className="reviews-section">
        <h3>
          <span role="img" aria-label="star">⭐</span>
          {avgRating} {reviewCount > 0 && `· ${reviewCount} ${reviewCount === 1 ? 'Review' : 'Reviews'}`}
        </h3>
        {reviewCount === 0 && currentUser && !isOwner ? (
          <p>Be the first to post a review!</p>
        ) : (
          <ul>
            {reviews.map((review) => {
              const reviewDate = new Date(review.createdAt);
              const monthYear = reviewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
              return (
                <li key={review.id}>
                  <p><strong>{review.User.firstName}</strong></p>
                  <p>{monthYear}</p>
                  <p>{review.review}</p>
                  <div className="review-images">
                    {review.ReviewImages && review.ReviewImages.map((image) => (
                      <img key={image.id} src={image.url} alt={`Review ${review.id}`} className="review-image" />
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

export default SpotDetail;
