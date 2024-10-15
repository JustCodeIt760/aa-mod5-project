import React from 'react';

function ConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <button className="red-button" onClick={onConfirm}>Yes (Delete Spot)</button>
        <button className="grey-button" onClick={onClose}>No (Keep Spot)</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;