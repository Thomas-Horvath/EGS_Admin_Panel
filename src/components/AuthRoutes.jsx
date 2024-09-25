import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // AuthContext importálása
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import Orders from '../pages/Orders';
import EditOrder from '../pages/EditOrder';
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
import AdminDetails from '../pages/AdminDetails';
import CustomerDetails from '../pages/CustomerDetails';
import Newsletter from '../pages/Newsletter';

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
                <Route path="/rendelés/:id" element={<OrderDetails />} />
                <Route path="/rendelés/szerkesztés/:id" element={<EditOrder />} />
                <Route path="/vásárlók" element={<Customers />} />
                <Route path="/vásárló/:id" element={<CustomerDetails />} />
                <Route path="/vásárló/szerkesztés/:id" element={<EditCustomer />} />
                <Route path="/adminok" element={<Admins />} />
                <Route path="/adminok/:id" element={<AdminDetails />} />
                <Route path="/adminok/regisztráció" element={<AddAdmin />} />
                <Route path="/adminok/szerkesztés/:id" element={<EditAdmin />} />
                <Route path="/profil" element={<Profile />} />
                <Route path="/profil/szerkesztés" element={<ProfileUpdate />} />
                <Route path="/hírlevél" element={<Newsletter />} />
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
