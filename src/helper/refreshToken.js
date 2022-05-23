import Axios from 'axios';
import { API_URL } from '../assets/constants';

export const refreshToken = async (cb) => {
  try {
    const response = await Axios.post(
      `${API_URL}/users/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${JSON.parse(localStorage.getItem('refreshToken'))}`,
        },
      }
    );
    cb({
      type: 'USER_REGISTER',
      payload: response.data.userData,
    });
    return response.data.userData;
  } catch (err) {
    console.log(err);
  }
};
