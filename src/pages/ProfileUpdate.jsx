import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ProfileUpdate = () => {

  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

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
      .then((data) => {

        setFormData(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');

    // Manuálisan készítjük el a payload-ot, nem küldjük el az _id-t
    const {
      FirstName,
      LastName,
      JobTitle,
      AdminRole,
      ActiveFlag,
      UserName,
      EmailAddress,
      PhoneNumber,
      BirthDate,
      Address
    } = formData;

    const payload = {
      FirstName,
      LastName,
      JobTitle,
      AdminRole,
      ActiveFlag,
      UserName,
      EmailAddress,
      PhoneNumber,
      BirthDate,
      Address
    };

    fetch('https://thomasapi.eu/api/profileupdate', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage('Sikeres frissítés!');
        setTimeout(() => {
          navigate('/profil');
        }, 2000);
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="profile-card-update">
      <h2>Profil szerkesztése</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="FirstName">Keresztnév:</label>
              <input
                type="text"
                id="FirstName"
                name="FirstName"
                value={formData.FirstName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="LastName">Vezetéknév:</label>
              <input
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="JobTitle">Beosztás:</label>
              <input
                type="text"
                id="JobTitle"
                name="JobTitle"
                value={formData.JobTitle || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="AdminRole">Adminisztrátori szerep:</label>
              <input
                type="text"
                id="AdminRole"
                name="AdminRole"
                value={formData.AdminRole || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="ActiveFlag">Aktív:</label>
              <select
                id="ActiveFlag"
                name="ActiveFlag"
                value={formData.ActiveFlag ? 'true' : 'false'}
                onChange={handleInputChange}
              >
                <option value="true">Aktív</option>
                <option value="false">Inaktív</option>
              </select>
            </div>
          </div>
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="UserName">Felhasználónév:</label>
              <input
                type="text"
                id="UserName"
                name="UserName"
                value={formData.UserName || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="EmailAddress">Email cím:</label>
              <input
                type="email"
                id="EmailAddress"
                name="EmailAddress"
                value={formData.EmailAddress || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="PhoneNumber">Telefonszám:</label>
              <input
                type="text"
                id="PhoneNumber"
                name="PhoneNumber"
                value={formData.PhoneNumber || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="BirthDate">Születési dátum:</label>
              <input
                type="date"
                id="BirthDate"
                name="BirthDate"
                value={formData.BirthDate ? formData.BirthDate.split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="Address">Cím:</label>
              <input
                type="text"
                id="Address"
                name="Address"
                value={formData.Address || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
        <div className="massage-container">
          {message && <div className="success-message">{message}</div>}
        </div>

        <div className="profile-edit-btn-wrapper">
          <button type="button" onClick={() => navigate('/profil')} className="btn">Vissza</button>
          <button type="submit" className="btn">Mentés</button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
