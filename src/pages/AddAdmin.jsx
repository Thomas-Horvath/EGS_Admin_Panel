import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';

const AddAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    UserName: '',
    Password: '',
    AdminRole: '',
    JobTitle: '',
    BirthDate: '',
    LastName: '',
    FirstName: '',
    EmailAddress: '',
    PhoneNumber: '',
    Postcode: '',
    City: '',
    Address: '',
    ActiveFlag: true
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.UserName) newErrors.UserName = 'A felhasználónév kötelező!';
    if (!formData.Password || formData.Password.length < 6) newErrors.Password = 'A jelszó kötelező és legalább 6 karakter hosszú kell legyen!';
    if (!formData.AdminRole) newErrors.AdminRole = 'Az admin szerepkör kötelező!';
    if (!formData.JobTitle) newErrors.JobTitle = 'A munkakör kötelező!';
    if (!formData.BirthDate) newErrors.BirthDate = 'A születési dátum kötelező!';
    if (!formData.LastName) newErrors.LastName = 'A vezetéknév kötelező!';
    if (!formData.FirstName) newErrors.FirstName = 'A keresztnév kötelező!';
    if (!formData.EmailAddress || !/\S+@\S+\.\S+/.test(formData.EmailAddress)) newErrors.EmailAddress = 'Érvényes email cím kötelező!';
    if (!formData.PhoneNumber) newErrors.PhoneNumber = 'A telefonszám kötelező!';
    if (!formData.Postcode) newErrors.Postcode = 'Az irányítószám kötelező!';
    if (!formData.City) newErrors.City = 'A város kötelező!';
    if (!formData.Address) newErrors.Address = 'A cím kötelező!';


    return newErrors;
  };


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }


    const token = sessionStorage.getItem('token');

    fetch('https://thomasapi.eu/api/adminregister', {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      mode: 'cors'
    })
      .then(res => res.json())
      .then(data => {
        setSuccessMessage('Az admin sikeresen regisztrálva!');
        setTimeout(() => { navigate('/adminok'); }, 2000);
      })
      .catch(err => {
        console.error(err);
        setSuccessMessage('Hiba történt a regisztráció során.');
      });
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };




  return (
    <div className="update-container">
      <h2>Új Admin Hozzáadása</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-container">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="UserName">Felhasználó név:</label>
              <input type="text" id="UserName" name="UserName" value={formData.UserName} onChange={handleChange} required />
              {errors.UserName && <p className="error">{errors.UserName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Password">Jelszó:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.Password && <p className="error">{errors.Password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="AdminRole">Admin szerepkör:</label>
              <select type="text" id="AdminRole" name="AdminRole" value={formData.AdminRole} onChange={handleChange} required >
                <option value="Tulajdonos">Tulajdonos</option>
                <option value="Alkalmazott">Alkalmazott</option>
              </select>

              {errors.AdminRole && <p className="error">{errors.AdminRole}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="JobTitle">Munkakör:</label>
              <select type="text" id="JobTitle" name="JobTitle" value={formData.JobTitle} onChange={handleChange} required >
                <option value="Ügyvezető Igazgató">Ügyvezető Igazgató</option>
                <option value="Igazgató Helyettes">Igazgató Helyettes</option>
                <option value="Raktáros">Raktáros</option>
                <option value="Értékesítő">Értékesítő</option>
                <option value="Rendszergazda">Rendszergazda</option>
              </select>
              {errors.JobTitle && <p className="error">{errors.JobTitle}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="BirthDate">Születési dátum:</label>
              <input type="date" id="BirthDate" name="BirthDate" value={formData.BirthDate} onChange={handleChange} required />
              {errors.BirthDate && <p className="error">{errors.BirthDate}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="LastName">Vezetéknév:</label>
              <input type="text" id="LastName" name="LastName" value={formData.LastName} onChange={handleChange} required />
              {errors.LastName && <p className="error">{errors.LastName}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="FirstName">Keresztnév:</label>
              <input type="text" id="FirstName" name="FirstName" value={formData.FirstName} onChange={handleChange} required />
              {errors.FirstName && <p className="error">{errors.FirstName}</p>}
            </div>

          </div>
          <div className="form-group-container">


            <div className="form-group">
              <label htmlFor="EmailAddress">Email cím:</label>
              <input type="email" id="EmailAddress" name="EmailAddress" value={formData.EmailAddress} onChange={handleChange} required />
              {errors.EmailAddress && <p className="error">{errors.EmailAddress}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="PhoneNumber">Telefonszám:</label>
              <input type="tel" id="PhoneNumber" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required />
              {errors.PhoneNumber && <p className="error">{errors.PhoneNumber}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Postcode">Irányítószám:</label>
              <input type="text" id="Postcode" name="Postcode" value={formData.Postcode} onChange={handleChange} required />
              {errors.Postcode && <p className="error">{errors.Postcode}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="City">Város:</label>
              <input type="text" id="City" name="City" value={formData.City} onChange={handleChange} required />
              {errors.City && <p className="error">{errors.City}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="Address">Cím:</label>
              <input type="text" id="Address" name="Address" value={formData.Address} onChange={handleChange} required />
              {errors.Address && <p className="error">{errors.Address}</p>}
            </div>

            <div className="form-group">
              <label>
                <input type="checkbox" name="ActiveFlag" checked={formData.ActiveFlag} onChange={handleInputChange} />
                <div className="custom-checkbox">
                  {formData.ActiveFlag && <FaCheck className="custom-checkbox-icon" />}
                </div>
                Aktív
              </label>
            </div>
          </div>
          {successMessage && <p className="alert">{successMessage}</p>}

        </div>
        <div className="button-group">
          <button onClick={() => navigate(-1)} className="btn">Vissza</button>
          <button type="submit" className="btn">Mentés</button>
        </div>
      </form>
    </div>
  );
};

export default AddAdmin;
