
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { img } from '../assets/assets';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    fetch('https://thomasapi.eu/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch((err) => console.error(err));
  }, []);

  if (!profileData) {
    return <div className="data-loading">Töltés...</div>;
  }

  return (
    <div className="page-container">
      <div className="card-container">
        <div className="profile-card">
          <div className="profile-header">
            <img
              src={img.placeholder} // Profil kép placeholder
              alt={`${profileData.FirstName} ${profileData.LastName}`}
              className="profile-picture"
            />
            <div className="profile-header-info">
              <h2>{profileData.LastName} {profileData.FirstName} </h2>
              <p>{profileData.JobTitle} - {profileData.AdminRole}</p>
              <p className={`status ${profileData.ActiveFlag ? 'active' : 'inactive'}`}>
                {profileData.ActiveFlag ? 'Aktív' : 'Inaktív'}
              </p>
            </div>
          </div>

          <hr className="divider" />

          <div className="profile-details">
            <div className="profile-info">
              <strong>Felhasználónév:</strong> {profileData.UserName}
            </div>
            <div className="profile-info">
              <strong>Email cím:</strong> {profileData.EmailAddress}
            </div>
            <div className="profile-info">
              <strong>Telefonszám:</strong> {profileData.PhoneNumber}
            </div>
            <div className="profile-info">
              <strong>Születési dátum:</strong> {new Date(profileData.BirthDate).toLocaleDateString()}
            </div>
            <div className="profile-info">
              <strong>Cím:</strong> {profileData.Postcode}, {profileData.City}, {profileData.Address}
            </div>
          </div>

          <div className="profile-edit-btn-wrapper">
            <Link to="/profil/szerkesztés"><button className="btn">Profil szerkesztése</button></Link>
          </div>
        </div>
      </div>
    </div>

  );
};

export default Profile;
