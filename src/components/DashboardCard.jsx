// DashboardCard.js
import React from 'react';

const DashboardCard = ({ title, value, background }) => {
  return (
    <div className="dashboard-card" style={{ background: background }}>
      <div className="dashboard-card-title">{title}</div>
      <div className="dashboard-card-value">{value}</div>
    </div>
  );
};

export default DashboardCard;
