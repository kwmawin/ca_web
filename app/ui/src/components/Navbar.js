import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({brandText, project}) => (
  <div className='Navbar'>
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <span className="navbar-brand mb-0 h1">{brandText}</span>
      <div>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          {project &&
            <li className="nav-item">
              <a className="nav-link" href={'/ca/'+project}>{project.toUpperCase()}</a>
            </li>
          }
          <li className="nav-item">
            <a className="nav-link" href="#">Wiki</a>
          </li>
        </ul>
      </div>
    </nav>
  </div>
);

Navbar.propTypes = {
  brandText: PropTypes.string
};


export default Navbar;