import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // AuthContext importálása
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import Orders from '../pages/Orders';
import OrderDetails from '../pages/OrderDetails';
import Customers from '../pages/Customers';
import EditCustomer from '../pages/EditCustomer';
import Admins from '../pages/Admins';
import AddAdmin from '../pages/AddAdmin';
import EditAdmin from '../pages/EditAdmin';
import Login from '../pages/Login';
import Profile from '../pages/Profile';
import ProfileUpdate from '../pages/ProfileUpdate';
import Header from './Header';
import Sidebar from './Sidebar';
import ProductDetails from '../pages/ProductDetails';

const AuthRoutes = ({ isOpen, setIsOpen }) => {
  const { isLoggedIn } = useContext(AuthContext);

  const toggleSidebar = () => {
    setIsOpen(prev => !prev); // Állapotváltás nyitott/zárt között
  };

  return (
    <>
      { isLoggedIn ? (  // Ha be van jelentkezve, rendereljük az alkalmazást
        <>
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div className="app-content">
            <Header isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
              <Routes>
                <Route path="/home" element={<Dashboard />} />
                <Route path="/termékek" element={<Products />} />
                <Route path="/termékek/:id" element={<ProductDetails />} />
                <Route path="/termékek/újtermék" element={<AddProduct />} />
                <Route path="/termékek/szerkesztés/:id" element={<EditProduct />} />
                <Route path="/rendelések" element={<Orders />} />
                <Route path="/rendelések/:id" element={<OrderDetails />} />
                <Route path="/vasarlók" element={<Customers />} />
                <Route path="/vasarlók/:id/szerkesztes" element={<EditCustomer />} />
                <Route path="/adminok" element={<Admins />} />
                <Route path="/adminok/regisztráció" element={<AddAdmin />} />
                <Route path="/adminok/:id/szerkesztes" element={<EditAdmin />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/profil/szerkesztés" element={<ProfileUpdate />} />
                <Route path="*" element={<Navigate to="/home" />} /> {/* Ha az útvonal nem létezik, átirányítás a főoldalra */}
              </Routes>
            </div>
          </div>
        </>
      ) : (  // Ha nincs bejelentkezve, csak a Login oldalt jelenítjük meg
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Minden más útvonal átirányít a bejelentkezésre */}
        </Routes>
      )}
    </>
  );
};

export default AuthRoutes;
