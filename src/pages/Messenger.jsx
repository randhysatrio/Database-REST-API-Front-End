import '../assets/styles/Messenger.css';
import Layout from '../components/Layout';
import FormControl from 'react-bootstrap/FormControl';

import Conversation from '../components/Conversation';
import ChatMessage from '../components/ChatMessage';
import OnlineFriend from '../components/OnlineFriend/OnlineFriend';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { MONGO_DB_URL, SOCKET_API_URL } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

import { io } from 'socket.io-client';

const Messenger = () => {
  const navigate = useNavigate();
  const userGlobal = useSelector((state) => state.user);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationsList, setConversationsList] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [chatList, setChatList] = useState([]);
  const scrollRef = useRef();
  const socket = useRef();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await Axios.get(`${MONGO_DB_URL}/conversations/${userGlobal.idusers}`);
        setConversationsList(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    if (!userGlobal.idusers) {
      navigate('/login', { replace: '/' });
    } else {
      fetchConversations();
    }
  }, []);

  useEffect(() => {
    socket.current = io(SOCKET_API_URL);
    socket.current.on('getMessage', (data) => {
      setArrivalMessage(data);
    });
    return () => {
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    socket.current.emit('userJoin', userGlobal.idusers);
    socket.current.on('fetchUsers', (users) => {
      setOnlineFriends(users);
    });
  }, [userGlobal]);

  useEffect(() => {
    console.log(currentConversation);
    if (
      currentConversation?.members.includes(arrivalMessage.senderId) &&
      currentConversation?.members.includes(arrivalMessage.receiverId)
    ) {
      setChatList((prevChat) => [...prevChat, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    const fetchChatMessages = async () => {
      try {
        const response = await Axios.get(`${MONGO_DB_URL}/messages/${currentConversation._id}`);
        setChatList(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchChatMessages();
  }, [currentConversation]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatList]);

  const renderConversations = () => {
    return conversationsList.map((conversations) => {
      return (
        <div
          key={conversations._id}
          onClick={() => {
            setCurrentConversation(conversations);
          }}
        >
          <Conversation conversationData={conversations} />
        </div>
      );
    });
  };

  const renderChats = () => {
    return chatList.map((chat) => {
      return (
        <div ref={scrollRef} key={chat._id}>
          <ChatMessage chatData={chat} />
        </div>
      );
    });
  };

  const renderOnlineFriends = () => {
    const dataToRender = onlineFriends.filter((friend) => friend.userID !== userGlobal.idusers);

    return dataToRender.map((friend) => {
      return <OnlineFriend friend={friend} />;
    });
  };

  const sendBtnHandler = async (e) => {
    const receiverId = currentConversation.members.find((id) => id !== userGlobal.idusers);
    const receiverData = onlineFriends.find((user) => user.userID == receiverId);

    if (receiverData) {
      socket.current.emit('sendMessage', {
        senderId: userGlobal.idusers,
        receiverId,
        receiverSocketId: receiverData.socketID,
        text: inputMessage,
      });
    }

    try {
      const response = await Axios.post(`${MONGO_DB_URL}/messages`, {
        conversationId: currentConversation._id,
        senderId: userGlobal.idusers,
        text: inputMessage,
      });
      setChatList([...chatList, response.data]);
      setInputMessage('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <Layout>
        <div className="messengerBody">
          <div className="conversationsContainer">
            <div className="conversationsContainerHeader">
              <span>Conversations</span>
            </div>
            <div className="conversationsListContainer">{renderConversations()}</div>
          </div>
          <div className="messengerDivider" />
          <div className="chatContainer">
            {currentConversation ? (
              <>
                <div className="chatContainerChats">
                  <div className="chatContainerChatsWrapper">{renderChats()}</div>
                </div>
                <div className="chatContainerInput">
                  <div className="chatContainerInputWrapper">
                    <FormControl
                      as="textarea"
                      id="chat-input"
                      placeholder="Write something.."
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                    />
                  </div>
                  <div className="chatContainerButtonWrapper">
                    <button className="btn btn-primary mb-3" id="send-button" onClick={sendBtnHandler}>
                      Send
                    </button>
                    <button className="btn btn-danger" id="clear-button" onClick={() => setInputMessage('')}>
                      Clear
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="noConversationWrapper">
                <span>Choose a conversation</span>
              </div>
            )}
          </div>
          <div className="messengerDivider" />
          <div className="onlineContainer">
            <div className="onlineContainerHeader">
              <span>Friends</span>
            </div>
            <div className="onlineContainerList">{renderOnlineFriends()}</div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default Messenger;
