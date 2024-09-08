import React from 'react';

import LoginProfileIcons from './LoginProfileIcons';
import { RiMenuUnfold2Line, RiMenuFold2Line } from "react-icons/ri";


const Header = ({isOpen , toggleSidebar}) => {
   

    const handleToggleSidebar = () => {
        toggleSidebar();  // Csak meghívjuk a toggleSidebar függvényt
    };
    return (
        <div className='header'>
            <div className="left">
                <div className="top">
                    {!isOpen ? (
                        <RiMenuFold2Line className='hamburger-icon' onClick={handleToggleSidebar} />
                    ) : (
                        <RiMenuUnfold2Line className='hamburger-icon' onClick={handleToggleSidebar} />
                    )}
                </div>
                
            </div>
            <div className="right">
                <LoginProfileIcons />
            </div>

        </div>
    )
}

export default Header