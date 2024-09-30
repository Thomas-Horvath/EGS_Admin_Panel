
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { img } from '../assets/assets';

const AdminDetails = () => {
  const [profileData, setProfileData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem('token');

    fetch(`${process.env.REACT_APP_API_URL}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (!profileData) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>;
  }

  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }

  return (
    (<div className="page-container">
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
            <strong>Cím:</strong> {profileData.Postcode} {profileData.City} {profileData.Address}
          </div>
          <div className="profile-info">
            <strong>Regisztráció dátuma:</strong> {profileData.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : "Ismeretlen"}
          </div>
          <div className="profile-info">
            <strong>Utolsó módosítás dátuma:</strong> {profileData.updatedAt ? new Date(profileData.updatedAt).toLocaleDateString() : "Ismeretlen"}
          </div>
        </div>

        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn">Vissza</button>
          <Link to={`/adminok/szerkesztés/${id}`}><button className="btn">Profil szerkesztése</button></Link>
        </div>
      </div>
    </div>)
  );
};

export default AdminDetails;
