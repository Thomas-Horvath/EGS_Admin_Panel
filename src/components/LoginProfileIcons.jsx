import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext';
import { img } from '../assets/assets';
import { MdAccountCircle } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoLogOut } from "react-icons/io5";

const LoginProfileIcons = () => {
  const [profile, setProfile] = useState([]);
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };


  function fetchProfile() {
    const token = sessionStorage.getItem('token');
    return fetch('https://thomasapi.eu/api/profile', {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
        "Authorization": `Bearer ${token}`
      },
      mode: "cors"
    })
      .then(res => res.json())
      .then(setProfile)

  };

 
  useEffect(() => {
    fetchProfile()
  }, [])

  return (
    <div className='icon-container' onClick={toggleMenu}>
      <div className="profile-data">
        <h3> {profile.LastName} {profile.FirstName}</h3>
        <p>{profile.AdminRole}</p>
      </div>
      <img className='placholder-img' src={img.placeholder} alt="profil kép"  />

      {/* Conditional rendering based on isOpen state */}
      {isOpen && (
        <ul className='login-submenu'>
          <li className='header'>Fiókom</li>
          <li ><Link className='link' to="/profil" ><MdAccountCircle /> Saját adatok</Link></li>
          <li ><Link className='link' to="/profil/szerkesztés" ><IoMdSettings /> Beállítás</Link></li>
          <hr/>
          <li className='link' onClick={logout}><IoLogOut /> Kilépés</li>
        </ul>
      )}
    </div>
  )
}

export default LoginProfileIcons;
