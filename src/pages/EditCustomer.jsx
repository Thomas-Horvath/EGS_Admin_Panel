import React, { useEffect, useState, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const EditCustomer = () => {


  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: '',
    LastName: '',
    JobTitle: '',
    AdminRole: '',
    ActiveFlag: 'true',
    UserName: '',
    EmailAddress: '',
    PhoneNumber: '',
    BirthDate: '',
    Address: '',
    Password: '' // alapértelmezett üres érték
  });
  

  useEffect(() => {
    setLoading(true);
    const token = sessionStorage.getItem('token');

    fetch(`https://thomasapi.eu/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        Authorization: `Bearer ${token}`,
      },
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((data) => {

        setFormData({
          ...data,
          Password: '', // Jelszó üresen marad
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
  });
  }, [id]);

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
     
      ActiveFlag,
      UserName,
      EmailAddress,
      PhoneNumber,
      BirthDate,
      Address,
      Password,
      IsAdmin = false,
    } = formData;

    const payload = {
      FirstName,
      LastName,
      ActiveFlag,
      UserName,
      EmailAddress,
      PhoneNumber,
      BirthDate,
      Address,
      IsAdmin
    };

    // Ha a Password mező nem üres, akkor hozzáadjuk a payloadhoz
    if (Password && Password.trim() !== '') {
      payload.Password = Password;
    }


    fetch(`https://thomasapi.eu/api/user/${id}`, {
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
          navigate('/vásárlók');
        }, 2000);
      })
      .catch((err) => console.error(err));
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  if (loading) {
    return <div className="data-loading">
      <div>Töltés...</div>
    </div>
  }

  return (
    <div className="update-container">
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
            <div className="form-group">
              <label htmlFor="Password">Új Jelszó:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  placeholder='Új jelszó'
                />
                <button
                  type="button"
                  className="password-toggle-btn btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

        
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


            </div>
            <div className="form-group-container">


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
        <div className="button-group">
          <button type="button" onClick={() => navigate('/vásárlók')} className="btn">Vissza</button>
          <button type="submit" className="btn">Mentés</button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
