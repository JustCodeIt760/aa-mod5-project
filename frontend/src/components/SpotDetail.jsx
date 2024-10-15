import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaStar } from 'react-icons/fa';
import ReviewFormModal from './ReviewFormModal'; // Import the modal component

function SpotDetail() {
  const { id } = useParams();
  const [spot, setSpot] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  
  const currentUser = useSelector(state => state.session.user);

  useEffect(() => {
    const fetchSpotDetails = async () => {
      try {
        const spotResponse = await fetch(`/api/spots/${id}`);
        const reviewsResponse = await fetch(`/api/spots/${id}/reviews`);
        
        if (!spotResponse.ok || !reviewsResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const spotData = await spotResponse.json();
        const reviewsData = await reviewsResponse.json();
        
        console.log(reviewsData); // Check the structure of reviewsData
        
        const validReviews = reviewsData.Reviews.filter(review => review.User && review.User.firstName);

        setSpot(spotData);
        setReviews(validReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
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
    setReviews([newReview, ...reviews]); // Add new review to the top of the list
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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

  return (
    <div className="spot-detail">
      <h1>{spot.name}</h1>
      <p>Location: {spot.city}, {spot.state}, {spot.country}</p>
      <div className="images">
        {spot.SpotImages && spot.SpotImages.length > 0 ? (
          <>
            <img src={spot.SpotImages[0].url} alt={spot.name} className="large-image" />
            <div className="small-images">
              {spot.SpotImages.slice(1, 5).map((image, index) => (
                <img key={index} src={image.url} alt={`${spot.name} ${index + 1}`} className="small-image" />
              ))}
            </div>
          </>
        ) : (
          <p>No images available</p>
        )}
      </div>
      <p>Hosted by {spot.Owner.firstName}, {spot.Owner.lastName}</p>
      <p>{spot.description}</p>
      <div className="callout-box">
        <p>${spot.price} <span>night</span></p>
        <div className="review-summary">
          <p>Average Rating: {averageRating} Stars</p>
          <p>{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <button className="reserve-button" onClick={handleReserveClick}>Reserve</button>
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
              <div key={review.id} className="review">
                <h3>{review.User && review.User.firstName}</h3>
                <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                <p>{review.review}</p>
              </div>
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
