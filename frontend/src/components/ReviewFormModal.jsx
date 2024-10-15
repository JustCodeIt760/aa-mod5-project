import React, { useState } from 'react';

function ReviewFormModal({ onClose, onSubmit, spotId }) {
  const [review, setReview] = useState('');
  const [stars, setStars] = useState(1);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': getCsrfToken(), // Use the CSRF token function
        },
        body: JSON.stringify({ review, stars }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Server error occurred');
      }

      const newReview = await response.json();
      onSubmit(newReview); // Pass the new review to the parent component
      onClose(); // Close the modal after successful submission
    } catch (err) {
      setError(err.message);
    }
  };

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

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>How was your stay?</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Leave your review here..."
            required
          />
          <div className="star-rating">
            <label htmlFor="stars">Stars</label>
            <select id="stars" value={stars} onChange={(e) => setStars(e.target.value)}>
              {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={review.length < 10 || stars < 1}>Submit Your Review</button>
        </form>
      </div>
    </div>
  );
}

export default ReviewFormModal;
