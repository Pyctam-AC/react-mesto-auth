import React from 'react';
import headerLogo from '../images/logo_mesto.svg';
import {Link, Navigate, useNavigate} from 'react-router-dom';

function Header({
  emailUser,
  loggedIn,
  handleLogOut
  }) {

  return (
    <header className="header">
      <img
        src={headerLogo}
        className="header__logo"
        alt="логотип Russia"
      />
      <nav className='header__nav'>
        {loggedIn ?
          <>
            <p
              className='header__nav-text'
            >
              {emailUser}
            </p>
            <p
              className='header__nav-link'
              onClick={handleLogOut}
            >
              Выйти
            </p>
          </>
          :
          <Link to="/signup" className="header__nav-link">
            Регистрация
          </Link>
        }
      </nav>
    </header>
  );
}

export default Header;
