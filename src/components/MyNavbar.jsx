import React, { useEffect } from 'react';
import '../assets/styles/MyNavbar.css';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

const MyNavbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);

  const logoutHandler = () => {
    localStorage.removeItem('refreshToken');
    dispatch({
      type: 'USER_LOGOUT',
    });
    navigate('/', { replace: true });
  };

  useEffect(() => {
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('.navbar-main-container');

      if (lastScrollY < window.scrollY) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
      lastScrollY = window.scrollY;
    });
  }, []);

  return (
    <div className="navbar-main-container">
      <div className="navbar-logo-container">
        <span
          onClick={() => {
            navigate('/');
          }}
          style={{
            cursor: 'pointer',
          }}
        >
          FullStack1.0
        </span>
      </div>
      {userGlobal.username ? (
        <div>
          <NavDropdown id="nav-dropdown-dark-example" title={`Hello, ${userGlobal.username}! `} menuVariant="dark">
            <NavDropdown.Item
              onClick={() => {
                if (userGlobal.role !== 'Admin') {
                  alert('You dont have permission to access this page');
                } else {
                  navigate('/adminusers');
                }
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              Admin
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                navigate('/upload');
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              Uploads
            </NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item className="d-grid gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  logoutHandler();
                }}
              >
                Logout
              </Button>
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      ) : (
        <div className="navbar-buttons-container">
          <button
            className="navbar-button-login"
            onClick={() => {
              navigate('/login');
            }}
          >
            Login
          </button>
          <button
            className="navbar-button-register"
            onClick={() => {
              navigate('/register');
            }}
          >
            Sign-Up
          </button>
        </div>
      )}
    </div>
  );
};

export default MyNavbar;
