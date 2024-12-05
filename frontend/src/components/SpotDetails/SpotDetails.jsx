import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from '../CreateReviewModal/CreateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal/DeleteReviewModal';
import './SpotDetails.css';

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch spot details
        const spotResponse = await fetch(`/api/spots/${spotId}`);
        const spotData = await spotResponse.json();

        // Fetch reviews
        const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
        const reviewsData = await reviewsResponse.json();

        // Fetch current user
        const userResponse = await fetch('/api/session');
        const userData = await userResponse.json();

        setSpot(spotData);
        setReviews(reviewsData.Reviews);
        setCurrentUser(userData.user);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [spotId]);

  const hasUserReviewed = currentUser && reviews.some(review =>
    review.User.id === currentUser.id
  );

  const isOwner = currentUser && spot?.Owner && currentUser.id === spot.Owner.id;

  const handleReviewSubmit = async (newReview) => {
    try {
      // Fetch updated spot details to get new rating
      const spotResponse = await fetch(`/api/spots/${spotId}`);
      const updatedSpot = await spotResponse.json();

      // Fetch updated reviews to get them in correct order
      const reviewsResponse = await fetch(`/api/spots/${spotId}/reviews`);
      const reviewsData = await reviewsResponse.json();

      // Update both spot and reviews state
      setSpot(updatedSpot);
      setReviews(reviewsData.Reviews);

    } catch (error) {
      console.error('Error updating after review:', error);
    }
  };

  const handleReviewDelete = (deletedReviewId) => {
    setReviews(reviews.filter(review => review.id !== deletedReviewId));
    const updatedNumReviews = spot.numReviews - 1;
    const updatedAvgRating = updatedNumReviews === 0 ? 0 :
      ((spot.avgStarRating * spot.numReviews) - reviews.find(r => r.id === deletedReviewId).stars) / updatedNumReviews;

    setSpot(prevSpot => ({
      ...prevSpot,
      numReviews: updatedNumReviews,
      avgStarRating: updatedAvgRating
    }));
  };

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  // Sort reviews by creation date in descending order
  const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (isLoading || !spot) return <div>Loading...</div>;

  return (
    <div className="spot-details">
      <div className="spot-header">
        <h1>{spot.name}</h1>
        <p className="spot-location">{spot.city}, {spot.state}, {spot.country}</p>
      </div>

      <div className="spot-images">
        <div className="main-image">
          <img src={spot.SpotImages[0]?.url || '/favicon.ico'} alt={spot.name} />
        </div>
        <div className="secondary-images">
          {spot.SpotImages.slice(1, 5).map((image, index) => (
            <div key={image.id} className="secondary-image">
              <img src={image.url} alt={`${spot.name} ${index + 2}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="spot-info-container">
        <div className="spot-info">
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p className="description">{spot.description}</p>
        </div>

        <div className="spot-booking">
          <div className="booking-header">
            <div className="price">
              <span className="amount">${spot.price}</span> night
            </div>
            <div className="rating-reviews">
              <span>★ {spot.avgStarRating?.toFixed(1) || 'New'}</span>
              {spot.numReviews > 0 && (
                <span> · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
              )}
            </div>
          </div>
          <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
        </div>
      </div>

      <div className="reviews-section">
        <h2>
          ★ {spot.avgStarRating?.toFixed(1) || 'New'}
          {spot.numReviews > 0 && (
            <span> · {spot.numReviews} {spot.numReviews === 1 ? 'review' : 'reviews'}</span>
          )}
        </h2>

        {currentUser &&
         !hasUserReviewed &&
         !isOwner && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<CreateReviewModal
              spotId={spotId}
              onReviewSubmit={handleReviewSubmit}
            />}
            className="post-review-button"
          />
        )}

        {sortedReviews.length > 0 ? (
          <div className="reviews-list">
            {sortedReviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <h3>{review.User.firstName}</h3>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="review-text">{review.review}</p>

                {currentUser && currentUser.id === review.userId && (
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={
                      <DeleteReviewModal
                        reviewId={review.id}
                        onReviewDelete={handleReviewDelete}
                      />
                    }
                    className="delete-review-button"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          currentUser &&
          !isOwner && (
            <p className="no-reviews">Be the first to post a review!</p>
          )
        )}
      </div>
    </div>
  );
}

export default SpotDetails;