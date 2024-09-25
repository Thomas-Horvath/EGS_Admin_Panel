import React, { useEffect, useState, } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { parsePhoneNumber } from 'libphonenumber-js';


const EditCustomer = () => {


  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
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
    Postcode: '',
    City: '',
    Address: '',
    Password: '' // alapértelmezett üres érték
  });




  const validateForm = () => {
    let errors = {};
    // Kötelező mezők ellenőrzése
    if (!formData.FirstName) errors.FirstName = 'A keresztnevet kötelező megadni.';

    if (!formData.LastName) errors.LastName = 'A vezetéknév kötelező megadni.';

    if (!formData.UserName) errors.UserName = 'A felhasználónevet kötelező megadni.';

    if (!formData.EmailAddress) errors.EmailAddress = 'Az email címet kötelező megadni.';


    // Telefonszám validálása
    if (formData.PhoneNumber.trim()) {
      try {
        const phoneNumber = parsePhoneNumber(formData.PhoneNumber, 'HU'); // Válaszd ki az országot
        if (!phoneNumber.isValid()) {
          errors.PhoneNumber = 'Érvénytelen telefonszám.';
        }
      } catch (error) {
        errors.PhoneNumber = 'Érvénytelen telefonszám.';
      }
    }

    return errors;
  };



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
    setMessage('');

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const formattedPhoneNumber = formData.PhoneNumber ? parsePhoneNumber(formData.PhoneNumber, 'HU').formatInternational() : '';

    // Manuálisan készítjük el a payload-ot, nem küldjük el az _id-t
    const {
      FirstName,
      LastName,
      ActiveFlag,
      UserName,
      EmailAddress,
      BirthDate,
      Postcode,
      City,
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
      PhoneNumber: formattedPhoneNumber,
      BirthDate,
      Postcode,
      City,
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
      <h2>Vásárló szerkesztése</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="FirstName">Keresztnév:</label>
              <input
                className={errors.FirstName ? 'input-error' : ''}
                type="text"
                id="FirstName"
                name="FirstName"
                value={formData.FirstName || ''}
                onChange={handleInputChange}
                placeholder='Keresztnév'
              />
              {errors.FirstName && <p className="error">{errors.FirstName}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="LastName">Vezetéknév:</label>
              <input
                className={errors.LastName ? 'input-error' : ''}
                type="text"
                id="LastName"
                name="LastName"
                value={formData.LastName || ''}
                onChange={handleInputChange}
                placeholder='Vezetéknév'
              />
              {errors.LastName && <p className="error">{errors.LastName}</p>}
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
                className={errors.UserName ? 'input-error' : ''}
                type="text"
                id="UserName"
                name="UserName"
                value={formData.UserName || ''}
                onChange={handleInputChange}
                placeholder='Felhasználónév'
              />
              {errors.UserName && <p className="error">{errors.UserName}</p>}
            </div>




            <div className="form-group">
              <label htmlFor="EmailAddress">Email cím:</label>
              <input
                className={errors.EmailAddress ? 'input-error' : ''}
                type="email"
                id="EmailAddress"
                name="EmailAddress"
                value={formData.EmailAddress || ''}
                onChange={handleInputChange}
                placeholder='példa@gmail.com'
              />
              {errors.EmailAddress && <p className="error">{errors.EmailAddress}</p>}
            </div>


          </div>
          <div className="form-group-container">


            <div className="form-group">
              <label htmlFor="PhoneNumber">Telefonszám:</label>
              <input
                className={errors.PhoneNumber ? 'input-error' : ''}
                type="text"
                id="PhoneNumber"
                name="PhoneNumber"
                value={formData.PhoneNumber || ''}
                onChange={handleInputChange}
                placeholder='+36 20 123 4567'
              />
              {errors.PhoneNumber && <p className="error">{errors.PhoneNumber}</p>}
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
              <label htmlFor="Postcode">Irányító szám:</label>
              <input
                type="number"
                min={1}
                step={1}
                id="Postcode"
                name="Postcode"
                maxLength="4"
                value={formData.Postcode || ''}
                onChange={handleInputChange}
                placeholder='Irányító szám'
              />
            </div>
            <div className="form-group">
              <label htmlFor="City">Város:</label>
              <input
                type="text"
                id="City"
                name="City"
                value={formData.City || ''}
                onChange={handleInputChange}
                placeholder='Város'
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
                placeholder='Cím'
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
