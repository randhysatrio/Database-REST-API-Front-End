import { useState, useEffect } from 'react';
import '../assets/styles/Login.css';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import swal from 'sweetalert';

import { Link, useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';

import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    userInfo: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const inputHandler = (e) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };

  const loginBtnHandler = async () => {
    if (!loginData.userInfo || !loginData.password) {
      swal('Heyyy', 'Please fill out your login form first!', 'warning');
    } else {
      try {
        const response = await Axios.post(`${API_URL}/users/login`, loginData);
        dispatch({
          type: 'USER_REGISTER',
          payload: response.data.userData,
        });
        if (response.data.message) {
          alert(response.data.message);
        }
        if (response.data.refreshToken) {
          localStorage.setItem('refreshToken', JSON.stringify(response.data.refreshToken));
        }
        navigate('/', { replace: true });
      } catch (err) {
        swal('Oops', `${err}`, 'error');
      }
    }
  };

  return (
    <div className="login-page-body">
      <div className="login-page-main-container">
        <div className="login-page-header">
          <span>Login Page</span>
        </div>
        <div className="login-page-input-container">
          <FormControl
            type="text"
            id="userInfo"
            placeholder="Insert username or email.."
            value={loginData.userInfo}
            onChange={inputHandler}
          />
        </div>
        <div className="login-page-input-container">
          <InputGroup>
            <InputGroup.Text
              id="show-password"
              onClick={() => {
                setShowPassword(!showPassword);
                const password = document.getElementById('password');
                if (password.type == 'password') {
                  password.type = 'text';
                } else {
                  password.type = 'password';
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </InputGroup.Text>
            <FormControl type="password" id="password" placeholder="Insert password.." value={loginData.password} onChange={inputHandler} />
          </InputGroup>
        </div>
        <div className="login-page-action-container">
          <button className="btn btn-success" onClick={loginBtnHandler}>
            Login
          </button>
          <Link to="/register">Don't have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
