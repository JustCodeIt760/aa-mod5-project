import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa'; // Import FaStar
import ReviewFormModal from './ReviewFormModal';
import ReviewItem from './ReviewItem';

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

function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Define loading state
  const [showModal, setShowModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);

  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        setLoading(true); // Start loading
        const spotResponse = await fetch(`/api/spots/${id}`);
        const reviewsResponse = await fetch(`/api/spots/${id}/reviews`);
        const spotData = await spotResponse.json();
        const reviewsData = await reviewsResponse.json();
        setSpot(spotData);
        setReviews(reviewsData.Reviews);
      } catch (error) {
        console.error('Error fetching spot details:', error);
        setError(error.message);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchSpotDetails();
  }, [id]);

  useEffect(() => {
    if (reviews.length > 0) {
      const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
      setAverageRating((totalStars / reviews.length).toFixed(1));
    } else {
      setAverageRating(0);
    }
  }, [reviews]);

  const handleReserveClick = () => {
    alert('Feature coming soon');
  };

  const handlePostReviewClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addNewReview = (newReview) => {
    setReviews([newReview, ...reviews]);
  };

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(),
        },
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== reviewId));
      } else {
        console.error('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  if (loading) return <div>Loading...</div>; // Display loading message
  if (error) return <div>Error: {error}</div>;
  if (!spot) return <div>No spot found</div>;

  const reviewDisplay = spot.numReviews > 0 
    ? (
      <>
        <FaStar />
        <span>{Number(spot.avgStarRating).toFixed(1)}</span>
        <span> · </span>
        <span>{spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
      </>
    )
    : (
      <>
        <FaStar />
        <span>New</span>
      </>
    );

  const hasPostedReview = currentUser && reviews.some(review => review.userId === currentUser.id);
  const canPostReview = currentUser && currentUser.id !== spot.Owner.id && !hasPostedReview;

  // Ensure we always have 5 image URLs (1 large + 4 small)
  const allImageUrls = [
    ...(spot.SpotImages || []).map(img => img.url),
    ...Array(5).fill('https://via.placeholder.com/200x200?text=No+Image')
  ].slice(0, 5);

  return (
    <div className="spot-detail">
      <h1 data-testid="spot-name">{spot.name}</h1>
      <p data-testid="spot-location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
      
      <div className="spot-images">
        <img src={allImageUrls[0]} alt={spot.name} data-testid="spot-large-image" className="large-image" />
        <div className="small-images">
          {allImageUrls.slice(1).map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`${spot.name} ${index + 1}`} data-testid="spot-small-image" />
          ))}
        </div>
      </div>

      <p data-testid="spot-host">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
      <p data-testid="spot-description">{spot.description}</p>

      <div data-testid="spot-callout-box" className="callout-box">
        <p data-testid="spot-price">${spot.price} / night</p>
        <button data-testid="reserve-button" onClick={handleReserveClick}>Reserve</button>
      </div>
      <div className="reviews-section">
        <h2>
          {averageRating} Stars ({reviews.length} Review{reviews.length !== 1 ? 's' : ''})
        </h2>
        {canPostReview && (
          <button className="post-review-button" onClick={handlePostReviewClick}>Post Your Review</button>
        )}
        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <ReviewItem key={review.id} review={review} onDelete={deleteReview} />
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>
      </div>
      {showModal && <ReviewFormModal onClose={handleCloseModal} onSubmit={addNewReview} spotId={id} />}
    </div>
  );
}

export default SpotDetail;
