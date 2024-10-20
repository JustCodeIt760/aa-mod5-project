import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa'; // Import FaStar
import ReviewFormModal from './ReviewFormModal';
import ReviewItem from './ReviewItem';
import './SpotDetail.css';
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
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        setLoading(true);
        const spotResponse = await fetch(`/api/spots/${id}`);
        const reviewsResponse = await fetch(`/api/spots/${id}/reviews`);
        const spotData = await spotResponse.json();
        const reviewsData = await reviewsResponse.json();

        
        setSpot(spotData);
        setReviews(reviewsData.Reviews);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        setIsLoading(false);
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
      }
    } catch (error) {
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) return <div>Error: {error}</div>;
  if (!spot) return <div>No spot found</div>;

  // Get the first image and the rest of the images
  const [firstImage, ...otherImages] = spot.SpotImages || [];

  // Fetch reviews and calculate the number of reviews
  const numReviews = reviews.length; // Assuming `reviews` is an array of review objects
  const avgRating = numReviews > 0 ? Number(spot.avgStarRating).toFixed(1) : 'New';
  const reviewText = numReviews === 1 ? 'Review' : 'Reviews';

  const userHasReviewed = currentUser && reviews.some(review => review.userId === currentUser.id);
  const canPostReview = currentUser && currentUser.id !== spot.Owner.id && !userHasReviewed;


  // Format the rating
  const formattedRating = avgRating !== 'New' ? `★${Number(avgRating).toFixed(1)}` : 'New';

  const hasReviews = numReviews > 0;
  const ratingDisplay = hasReviews ? `★${Number(avgRating).toFixed(1)}` : 'New';


  return (
    <div className="spot-detail">
      <h1 data-testid="spot-heading">{spot.name}</h1>
      <p data-testid="spot-detail-page-location">{`${spot.city}, ${spot.state}, ${spot.country}`}</p>
      
      <div className="spot-images">
        <div className="large-image-container">
          <img 
            src={firstImage?.url || spot.previewImage} 
            alt={spot.name} 
            className="large-image" 
            data-testid="spot-large-image" 
          />
        </div>
        <div className="small-images-grid">
          {otherImages.slice(0, 4).map((image, index) => (
            <img 
              key={index} 
              src={image.url} 
              alt={`${spot.name} ${index + 2}`} 
              className="small-image"
              data-testid="spot-small-image" 
            />
          ))}
        </div>
      </div>

      <div className="spot-info-container">
        <div className="spot-info-left">
          <div data-testid="spot-host">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</div>
          <p data-testid="spot-description">{spot.description}</p>
        </div>
        <div data-testid="spot-callout-box" className="callout-box">
          <p role="paragraph">
            <span data-testid="spot-price">${spot.price} / night</span>
            <br />
            <span data-testid="spot-rating">{ratingDisplay}</span>
            {hasReviews && (
              <>
                <span> · </span>
                <span data-testid="review-count">{numReviews} {reviewText}</span>
              </>
            )}
          </p>
          <button 
            data-testid="reserve-button"
            onClick={() => alert('Feature coming soon')}
          >
            Reserve
          </button>
        </div>
      </div>
      <h2 data-testid="reviews-heading">
        <span data-testid="spot-rating">{ratingDisplay}</span>
        {hasReviews && (
          <>
            <span> · </span>
            <span data-testid="review-count">{numReviews} {reviewText}</span>
          </>
        )}
      </h2>

      {!hasReviews && currentUser && currentUser.id !== spot.Owner.id && (
        <p>Be the first to post a review!</p>
      )}

      <div className="reviews-section">
        {canPostReview && (
          <button 
            className="post-review-button" 
            onClick={handlePostReviewClick} 
            data-testid="review-button"
          >
            Post Your Review
          </button>
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
      {showModal && (
        <ReviewFormModal 
          onClose={handleCloseModal} 
          onSubmit={addNewReview} 
          spotId={id} 
          data-testid="create-a-review-modal"
        />
      )}
    </div>
  );
}

export default SpotDetail;
