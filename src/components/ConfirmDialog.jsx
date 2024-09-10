import React from 'react';


const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <p>{message}</p>
        <div className="button-group">
          <button className="confirm-button" onClick={onConfirm}>Igen</button>
          <button className="cancel-button" onClick={onCancel}>Mégsem</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
