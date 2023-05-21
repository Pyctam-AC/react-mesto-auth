import React from 'react';
import headerLogo from '../images/logo_mesto.svg';
import {Link, useLocation} from 'react-router-dom';

function Header({
  emailUser,
  handleLogOut
  }) {

  const location = useLocation();

  return (
    <header className="header">
      <img
        src={headerLogo}
        className="header__logo"
        alt="логотип Russia"
      />
      <nav className='header__nav'>
        {location.pathname === "/" &&
          <>
            <p className='header__nav-text'>{emailUser}</p>
            <p className='header__nav-link'onClick={handleLogOut}>Выйти</p>
          </>}

          {location.pathname === "/signup" && <Link to="/signin" className="header__nav-link">Войти</Link>}
          {location.pathname === "/signin" && <Link to="/signup" className="header__nav-link">Регистрация</Link>}

      </nav>
    </header>
  );
}

export default Header;
