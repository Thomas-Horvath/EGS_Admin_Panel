// DashboardCard.js
import React from 'react';

const DashboardCard = ({ title, value, background , icon, unit}) => {
  return (
    <div className="dashboard-card" style={{ background: background }}>
      <div className="dashboard-data-wrapper">
        <div className="dashboard-card-title">{title}</div>
        <div className="dashboard-card-value">{value}<span className='unit'>{unit}</span></div>
      </div>
      <div className="icon">{icon}</div>
    </div>
  );
};

export default DashboardCard;
