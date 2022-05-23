import React, { useState, useEffect } from 'react';
import '../assets/styles/Register.css';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import swal from 'sweetalert';

import { useFormik } from 'formik';
import * as Yup from 'yup';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validate = Yup.object({
    firstName: Yup.string().max(15, 'Must be 15 characters or less').required('Required'),
    lastName: Yup.string().max(20, 'Must be 20 characters or less').required('Required'),
    email: Yup.string().email('Invalid email address').required('Required'),
    username: Yup.string()
      .max(15, 'Username cannot be more than 15 characters!')
      .matches(/^[a-zA-Z0-9]{6,15}$/, 'Username must at least be 6 characters long, and cannot contain special characters')
      .required('Required'),
    password: Yup.string()
      .matches(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$$/,
        'Password must at least be 8 characters long, contain one uppercase letter, one lowercase letter and one number'
      )
      .required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
    },
    validationSchema: validate,
    onSubmit: async (values) => {
      try {
        const response = await Axios.post(`${API_URL}/users/register`, values);
        dispatch({
          type: 'USER_REGISTER',
          payload: response.data.userData,
        });
        swal('Thankyou!', 'Now you are officialy one of our members!', 'success');
        navigate('/', { replace: true });
      } catch (err) {
        swal('Welp..', `Sorry, it seems we're unable to register you right now`, 'error');
      }
    },
  });

  return (
    <div className="register-page-body">
      <div className="register-page-form-container">
        <div className="register-page-form-header">
          <span>Register Page</span>
        </div>
        <div className="register-page-input-container">
          <form onSubmit={formik.handleSubmit}>
            <label htmlFor="firstName" className="mt-3 fw-bold">
              First Name
            </label>
            <FormControl
              id="firstName"
              name="firstName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.firstName}
            />
            {formik.touched.firstName && formik.errors.firstName ? <div className="error">{formik.errors.firstName}</div> : null}
            <label htmlFor="lastName" className="mt-3 fw-bold">
              Last Name
            </label>
            <FormControl
              id="lastName"
              name="lastName"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.lastName}
            />
            {formik.touched.lastName && formik.errors.lastName ? <div className="error">{formik.errors.lastName}</div> : null}
            <label htmlFor="username" className="mt-3 fw-bold">
              Username
            </label>
            <FormControl
              id="username"
              name="username"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username ? <div className="error">{formik.errors.username}</div> : null}
            <label htmlFor="email" className="mt-3 fw-bold">
              Email
            </label>
            <FormControl
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? <div className="error">{formik.errors.email}</div> : null}
            <label htmlFor="password" className="mt-3 fw-bold">
              Password
            </label>
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
              <FormControl
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </InputGroup>
            {formik.touched.password && formik.errors.password ? <div className="error">{formik.errors.password}</div> : null}
            <div className="register-page-action-container">
              <button type="submit" className="btn btn-success me-auto">
                Sign me up!
              </button>
              <Link to="/login">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
