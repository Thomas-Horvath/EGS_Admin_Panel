import React, { useState } from 'react';
import { FaHome, FaShoppingCart, FaUser, FaUserPlus } from "react-icons/fa";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import { RiArrowDropDownLine } from "react-icons/ri";
import { Link } from 'react-router-dom';
import { img } from '../assets/assets';
import { AiOutlineClose } from 'react-icons/ai';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openMenu, setOpenMenu] = useState(null); // The currently open submenu
  const [activeMenuItem, setActiveMenuItem] = useState('home'); // The active main menu item

  const closeSidebar = () => {
    setIsOpen(false); // Close the sidebar
  };

  const toggleSubMenu = (menu) => {
    setOpenMenu(prev => (prev === menu ? null : menu)); // Toggle submenu
  };

  // Handle click for main menu items
  const handleMainLinkClick = (item) => {
    setActiveMenuItem(item); // Set the active main menu item
    toggleSubMenu(item)
  };


  const handleHomeLinkClick = (item) => {
    setActiveMenuItem(item);
    if (window.innerWidth < 768) {
      closeSidebar();
    }

  }
  // Handle click for submenu links
  const handleLinkClick = () => {
    setOpenMenu(null); // Close all submenus
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {/* Close button */}
      {isOpen && (
        <div className="close-btn-container">
          <AiOutlineClose className="close-btn" onClick={closeSidebar} />
        </div>
      )}

      <div className="menu-container">
        {isOpen ? <img className='logo' src={img.logo} alt="logo" /> : <img className='logo-fav' src={img.favicon} alt="logo" />}

        <ul className='menu'>
          <li className='menu-items'>
            <Link
              to="/home"
              className={`menu-items-link  ${activeMenuItem === 'home' ? 'active' : ''}`}
              onClick={() => handleHomeLinkClick('home')}
            >
              <FaHome className='menu-icons' />
              {isOpen && <span className="menu-text">Kezdőlap</span>}
            </Link>
          </li>

          <li className='menu-items'>
            <div
              className={`menu-items-link ${activeMenuItem === 'products' ? 'active' : ''}`}
              onClick={() => handleMainLinkClick('products')}
            >
              <FaShoppingCart className='menu-icons' />
              {isOpen && <span className="menu-text">Termékek <RiArrowDropDownLine /></span>}
            </div>
            {openMenu === 'products' && (
              <ul className={`submenu ${isOpen ? '' : 'popup'}`}>
                <li><Link to="/termékek" onClick={handleLinkClick}>Termékek listája</Link></li>
                <li><Link to="/termékek/újtermék" onClick={handleLinkClick}>Új termék hozzáadása</Link></li>
              </ul>
            )}
          </li>

          <li className='menu-items'>
            <div
              className={`menu-items-link ${activeMenuItem === 'orders' ? 'active' : ''}`}
              onClick={() => handleMainLinkClick('orders')}
            >
              <BsFileEarmarkPlusFill className='menu-icons' />
              {isOpen && <span className="menu-text">Rendelések <RiArrowDropDownLine /></span>}
            </div>
            {openMenu === 'orders' && (
              <ul className={`submenu ${isOpen ? '' : 'popup'}`}>
                <li><Link to="/rendelések" onClick={handleLinkClick}>Rendelések listája</Link></li>
                <li><Link to="/rendelések/:id" onClick={handleLinkClick}>Rendelés részletei</Link></li>
              </ul>
            )}
          </li>

          <li className='menu-items'>
            <div
              className={`menu-items-link ${activeMenuItem === 'customers' ? 'active' : ''}`}
              onClick={() => handleMainLinkClick('customers')}
            >
              <FaUser className='menu-icons' />
              {isOpen && <span className="menu-text">Vásárlók <RiArrowDropDownLine /></span>}
            </div>
            {openMenu === 'customers' && (
              <ul className={`submenu ${isOpen ? '' : 'popup'}`}>
                <li><Link to="/vasarlók" onClick={handleLinkClick}>Vásárlók listája</Link></li>
                <li><Link to="/vasarlók/uj" onClick={handleLinkClick}>Új vásárló hozzáadása</Link></li>
              </ul>
            )}
          </li>

          <li className='menu-items'>
            <div
              className={`menu-items-link ${activeMenuItem === 'admins' ? 'active' : ''}`}
              onClick={() => handleMainLinkClick('admins')}
            >
              <FaUserPlus className='menu-icons' />
              {isOpen && <span className="menu-text">Adminok <RiArrowDropDownLine /></span>}
            </div>
            {openMenu === 'admins' && (
              <ul className={`submenu ${isOpen ? '' : 'popup'}`}>
                <li><Link to="/adminok" onClick={handleLinkClick}>Adminok listája</Link></li>
                <li><Link to="/adminok/regisztráció" onClick={handleLinkClick}>Új admin hozzáadása</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
