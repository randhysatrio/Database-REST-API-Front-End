import './ChatMessage.css';
import * as timeago from 'timeago.js';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Axios from 'axios';
import { API_URL } from '../../assets/constants';

const ChatMessage = ({ chatData }) => {
  const userGlobal = useSelector((state) => state.user);
  const [senderInfo, setSenderInfo] = useState({});

  useEffect(() => {
    const fetchSenderData = async () => {
      try {
        const response = await Axios.get(`${API_URL}/users/${chatData.senderId}`);
        setSenderInfo(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSenderData();
  }, []);

  return (
    <div className={chatData.senderId == userGlobal.idusers ? 'chatMessageWrapperOwn' : 'chatMessageWrapper'}>
      <div className={chatData.senderId == userGlobal.idusers ? 'chatMessageBallonOwn' : 'chatMessageBallon'}>
        <div className="chatMessageUsernameWrapper">
          <span className="chatMessageUsername">{senderInfo.username}</span>
        </div>
        <div className="chatMessageTextWrapper">
          <span className="chatMessageText">{chatData.text}</span>
        </div>
      </div>
      <span className="chatMessageTime ms-2">{timeago.format(chatData.createdAt)}</span>
    </div>
  );
};

export default ChatMessage;
