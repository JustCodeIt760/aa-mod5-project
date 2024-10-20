import React from 'react';
import './ReviewConfirmationModal.css';

function ReviewConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="modal" data-testid="delete-review-modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <button className="red-button" onClick={onConfirm}>Yes (Delete Review)</button>
        <button className="grey-button" onClick={onClose}>No (Keep Review)</button>
      </div>
    </div>
  );
}

export default ReviewConfirmationModal;
