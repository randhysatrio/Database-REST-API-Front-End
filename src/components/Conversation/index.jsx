import './Conversation.css';
import Currents from '../../assets/images/currents.jpg';

import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import Axios from 'axios';
import { API_URL } from '../../assets/constants';

const Conversation = ({ conversationData }) => {
  const userGlobal = useSelector((state) => state.user);
  const [receiverData, setReceiverData] = useState({});

  const fetchReceiverData = async () => {
    const friendId = conversationData.members.find((id) => id !== userGlobal.idusers);
    try {
      const response = await Axios.get(`${API_URL}/users/${friendId}`);
      setReceiverData(response.data[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReceiverData();
  }, []);

  return (
    <div className="conversation">
      <div className="conversationWrapper">
        <div className="conversationPicture">
          <div className="conversationPictureContainer">
            <img src={Currents} />
          </div>
        </div>
        <div className="conversationName">
          <span>{receiverData.username}</span>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
