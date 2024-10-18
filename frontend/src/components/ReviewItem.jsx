import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import ReviewConfirmationModal from './ReviewConfirmationModal'; // Import the modal

function ReviewItem({ review, onDelete }) {
  const currentUser = useSelector(state => state.session.user);
  const [showModal, setShowModal] = useState(false);

  // Open the confirmation modal
  const handleDeleteClick = () => {
    setShowModal(true);
  };

  // Confirm deletion and close the modal
  const handleConfirmDelete = () => {
    onDelete(review.id); // Perform the deletion
    setShowModal(false);
  };

  // Close the modal without deleting
  const handleCloseModal = () => {
    setShowModal(false);
  };

  console.log('Review:', review);

  return (
    <div className="review">
      <h3>{review.User && review.User.firstName}</h3>
      <p>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
      <p>{review.review}</p>
      {currentUser && currentUser.id === review.userId && (
        <button onClick={handleDeleteClick}>Delete</button>
      )}
      {showModal && (
        <ReviewConfirmationModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default ReviewItem;
