import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import Axios from 'axios';
import { API_URL } from './assets/constants';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Verification from './pages/Verification';
import Adminusers from './pages/Adminusers';
import ChatPage from './pages/ChatPage';
import Upload from './pages/Upload';
import Messenger from './pages/Messenger';

function App() {
  const dispatch = useDispatch();
  const refreshToken = JSON.parse(localStorage.getItem('refreshToken'));

  useEffect(() => {
    if (refreshToken) {
      Axios.post(
        `${API_URL}/users/persistent`,
        {},
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      )
        .then((response) => {
          dispatch({
            type: 'USER_REGISTER',
            payload: response.data.userData,
          });
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      return;
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verification/:token" element={<Verification />} />
          <Route path="adminusers" element={<Adminusers />} />
          <Route path="chatpage" element={<Messenger />} />
          {/* <Route path="chatpage" element={<ChatPage />} /> */}
          <Route path="upload" element={<Upload />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
