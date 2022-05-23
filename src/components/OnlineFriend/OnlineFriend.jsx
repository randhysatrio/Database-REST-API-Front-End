import './OnlineFriend.css';
import image from '../../assets/images/innerspeaker.png';

import { useEffect, useState } from 'react';
import Axios from 'axios';
import { API_URL } from '../../assets/constants';

const OnlineFriend = ({ friend }) => {
  const [friendData, setFriendData] = useState({});

  useEffect(() => {
    const fetchFriendData = async () => {
      try {
        const response = await Axios.get(`${API_URL}/users/${friend.userID}`);
        setFriendData(response.data[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriendData();
  });

  return (
    <div className="onlineFriend">
      <div className="onlineFriendWrapper">
        <div className="onlineFriendPicture">
          <div className="onlineFriendImageContainer">
            <img src={image} />
          </div>
        </div>
        <div className="onlineFriendName">
          <span>
            {friendData.firstName} {friendData.lastName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OnlineFriend;
