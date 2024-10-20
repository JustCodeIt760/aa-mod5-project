import React, { useState, useEffect } from 'react';
import ReviewItem from './ReviewItem';

function ReviewManagement() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data.Reviews);
    };

    fetchReviews();
  }, []);

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

  return (
    <div className="review-management">
      <h1>Manage Reviews</h1>
      <div className="reviews-list">
        {reviews.length > 0 ? (
          reviews.map(review => (
            <ReviewItem key={review.id} review={review} onDelete={deleteReview} />
          ))
        ) : (
          <p>No reviews to manage.</p>
        )}
      </div>
    </div>
  );
}

export default ReviewManagement;