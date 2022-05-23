import { useEffect, useState } from 'react';
import '../assets/styles/Verification.css';
import { BsCheck2All } from 'react-icons/bs';

import { Link, useParams } from 'react-router-dom';
import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useDispatch } from 'react-redux';

const Verification = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await Axios.patch(
          `${API_URL}/users/verify`,
          {},
          {
            headers: {
              Authorization: `Bearer ${params.token}`,
            },
          }
        );
        localStorage.setItem('refreshToken', JSON.stringify(params.token));
        dispatch({
          type: 'USER_REGISTER',
          payload: response.data.userData,
        });
        setSuccess(true);
      } catch (err) {
        console.log(err);
      }
    };
    verifyUser();
  }, []);

  return (
    <div className="verification-page-body">
      <div className="verification-main-container">
        {success ? (
          <>
            <span className="verification-page-header">Thankyou!</span>
            <div className="verification-page-text">
              <span>Your email has been verified</span>
              <BsCheck2All className="ms-2" style={{ color: 'green' }} />
            </div>
          </>
        ) : (
          <span>Loading..</span>
        )}
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Verification;
