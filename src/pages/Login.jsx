import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { IoEye, IoEyeOffSharp } from "react-icons/io5";


const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');



  const { login } = useContext(AuthContext);
  const validateForm = () => {
    let errors = {};
    if (!userName) errors.userName = 'A felhasználónév kitöltése kötelező.';
    if (!password) errors.password = 'A jelszó kitöltése kötelező.';
    return errors;
  };


  const handleLogin = async (e) => {
    e.preventDefault(); // Ne töltse újra az oldalt

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    try {
      const response = await fetch('https://thomasapi.eu/api/adminlogin', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
        mode: "cors",
        body: JSON.stringify({
          "UserName": userName,
          "Password": password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bejelentkezés sikertelen');
      }

      const data = await response.json();
 

      // Ha van token a válaszban
      if (data.token) {
        // Mentsük el a sessionStorage-be
        login(data.token);
      

      } else {
        // Hiba kezelése, pl. hibás bejelentkezési adatok
        setMessage('Bejelentkezés sikertelen');
      }
    } catch (error) {
      setMessage(error.message || 'Hiba történt a bejelentkezés során.');

    }
  };


  return (
    <div className='login-page'>
      <div className="form-container">
        <form className='login-form' onSubmit={handleLogin} method='POST' noValidate>
          <h1 className="heading">EGS - Admin Panel</h1>
         <hr/>
          <label className='loginpage-label' htmlFor="email">Felhasználó név:</label>
          <input
            className={`loginpage-input ${errors.userName ? 'input-error' : ''}`}
            id="email"
            type="text"
            name='userName'
            value={userName}
            onChange={(e) => setUserName(e.target.value.trim())}
            placeholder="Felhasználónév"

          />
          {errors.userName && <p className="error-text">{errors.userName}</p>}
          <label className='loginpage-label' htmlFor="password">Jelszó:</label>
          <div className="password-container">
            <input
              className={`loginpage-input ${errors.password ? 'input-error' : ''}`}
              id="password"
              type={showPassword ? 'text' : 'password'}
              name='password'
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
            />
            <button className='eye-icon-btn' type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <IoEyeOffSharp /> : <IoEye />}
            </button>
          </div>
          <div className="error-container">
            {errors.password && <p className="error-text">{errors.password}</p>}

            {message && <p className='error-message'>{message}</p>}
          </div>


          <div className="btn-container">
            <button className='btn login-btn' type='submit'>Bejelentkezés</button>
          </div>


        </form>
      </div>
    </div>
  )
}

export default Login;