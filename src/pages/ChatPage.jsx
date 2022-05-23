import Layout from '../components/Layout';
import '../assets/styles/ChatPage.css';
import FormControl from 'react-bootstrap/FormControl';
import { TiMessageTyping } from 'react-icons/ti';
import { AiOutlineMessage } from 'react-icons/ai';
import { BsChatQuote } from 'react-icons/bs';
import { toast } from 'react-toastify';
import swal from 'sweetalert';

import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Axios from 'axios';
import { io } from 'socket.io-client';

const CHAT_API_URL = 'http://localhost:7000';

// https://www.npmjs.com/package/react-input-emoji

const ChatPage = () => {
  const userGlobal = useSelector((state) => state.user);
  const [username, setUsername] = useState('');
  const [join, setJoin] = useState(false);
  const [currentSpace, setCurrentSpace] = useState('lounge');
  const [messages, setMessages] = useState([]);
  const [messagesRoom, setMessagesRoom] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [inputMessage2, setInputMessage2] = useState('');
  const scrollRef = useRef();
  const socket = io(CHAT_API_URL);

  // const joinChat = (path) => {
  //   if (username || userGlobal.username) {
  //     setChannelPath(path);
  //     const socket = io(CHAT_API_URL + path);
  //     socket.emit('joinChat', { name: username });
  //     // socket.on('Chat Message', (messages) => setMessages(messages));
  //     socket.on('fetchChat', (data) => setMessages(data));
  //   } else {
  //     swal('Please fill in the username or sign in to use this feature');
  //   }
  // };

  // const joinRoom = (room) => {
  //   if (username || userGlobal.username) {
  //     const socket = io(CHAT_API_URL + '/');
  //     socket.emit('joinRoom', { name: userGlobal.username ? userGlobal.username : username, room });
  //     socket.on('roomNotif', (notif) => {
  //       alert(notif);
  //     });
  //     socket.on('messagesRoom', (messages) => {
  //       setMessagesRoom(messages);
  //     });
  //   } else {
  //     swal('Please fill in the username or sign in to use this feature');
  //   }
  // };

  // const sendBtnHandler = async () => {
  //   try {
  //     let link;
  //     if (channelPath == '/') {
  //       link = `${CHAT_API_URL}/sendmessage?space=default`;
  //     } else if (channelPath == '/customchannel') {
  //       link = `${CHAT_API_URL}/sendmessage?space=customchannel`;
  //     }
  //     await Axios.post(link, { username: userGlobal.username ? userGlobal.username : username, message: inputMessage });
  //     setInputMessage('');
  //     alert('Message sent!');
  //   } catch (err) {
  //     alert(err);
  //   }
  // };

  const sendBtnHandlerRoom = async (room) => {
    try {
      await Axios.post(`${CHAT_API_URL}/sendmessage?space=default`, {
        username: userGlobal.username ? userGlobal.username : username,
        message: inputMessage2,
        room,
      });
      setInputMessage2('');
      alert('Message sent!');
    } catch (err) {
      alert(err);
    }
  };

  const renderMessages = (array) => {
    return array.map((message) => {
      return (
        <div
          ref={scrollRef}
          id="messages-ballon"
          className="chat-messages-box-container"
          style={{
            display: 'flex',
            justifyContent: username == message.username || userGlobal.username == message.username ? 'flex-start' : 'flex-end',
          }}
        >
          <div
            className="chat-messages-container"
            style={{
              backgroundColor: username == message.username || userGlobal.username == message.username ? 'palegreen' : 'paleturqoise',
            }}
          >
            <span className="chat-username">{message.username}</span>
            <span>{message.message}</span>
          </div>
        </div>
      );
    });
  };

  useEffect(() => {
    socket.emit(currentSpace, { name: username });
    socket.on(`${currentSpace}`, (data) => toast.success(data, { position: 'top-center' }));

    socket.on(`${currentSpace}Chat`, (data) => setMessages(data));
    return () => {
      socket.close();
    };
  }, [currentSpace]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Layout>
      {join ? (
        <div className="chat-page-body">
          <div className="chat-page-header">
            <TiMessageTyping style={{ color: 'green' }} className="me-2" />
            <span>ChatPage (Beta)</span>
          </div>
          <div className="chat-page-room-container">
            <button
              className="btn btn-primary"
              onClick={() => {
                setCurrentSpace('Lounge');
              }}
            >
              #lounge
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setCurrentSpace('Science');
              }}
            >
              #science
            </button>
          </div>
          <div className="chat-page-chat-container">
            <div className="chat-page-chat-header">
              <AiOutlineMessage style={{ color: 'dodgerblue' }} />
              <span>Messages</span>
            </div>
            <div className="chat-page-messages-container">{renderMessages(messages)}</div>
          </div>
          <div className="chat-page-input-container">
            <FormControl
              as="textarea"
              style={{ height: '6rem', width: '80%', borderRadius: '1rem' }}
              placeholder="Insert your messages here.."
              maxLength={150}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
              }}
            />
            <div className="chat-page-input-button-container">
              <button
                className="btn btn-success"
                onClick={() => {
                  // if (currentSpace === 'lounge') {
                  //   socket.emit('chatLounge', { username: userGlobal.username ? userGlobal.username : username, message: inputMessage });
                  //   socket.on('fetchChat', (data) => setMessages(data));
                  // } else if (currentSpace === 'science') {
                  //   socket.emit('chatScience', { username: userGlobal.username ? userGlobal.username : username, message: inputMessage });
                  //   socket.on('fetchChatScience', (data) => setMessages(data));
                  // }
                  socket.emit(`${currentSpace}Chat`, { username, message: inputMessage });
                  setInputMessage('');
                }}
              >
                Send
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setInputMessage('');
                }}
              >
                Clear
              </button>
            </div>
          </div>
          <div className="chat-page-chat-container">
            <div className="chat-page-chat-header">
              <BsChatQuote style={{ color: 'limegreen' }} />
              <span>Room_1</span>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  // joinRoom('room1');
                }}
              >
                Join Room
              </button>
            </div>
            <div className="chat-page-messages-container">{renderMessages(messagesRoom)}</div>
          </div>
          <div className="chat-page-input-container">
            <FormControl
              as="textarea"
              style={{ height: '6rem', width: '80%', borderRadius: '1rem' }}
              placeholder="Insert your messages here.."
              maxLength={150}
              value={inputMessage2}
              onChange={(e) => {
                setInputMessage2(e.target.value);
              }}
            />
            <div className="chat-page-input-button-container">
              <button className="btn btn-success" onClick={() => sendBtnHandlerRoom('room1')}>
                Send
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  setInputMessage('');
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="chat-page-login-body">
          <div className="chat-page-login-container">
            <div className="chat-page-login-header">
              <TiMessageTyping style={{ color: 'green' }} className="me-2" />
              <span>ChatPage (Beta)</span>
            </div>
            <div className="chat-page-login-input">
              {userGlobal.username ? null : (
                <FormControl
                  className="mb-4"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Insert your username.."
                />
              )}
              <button
                className="btn btn-success"
                onClick={() => {
                  if (userGlobal.username) {
                    setUsername(userGlobal.username);
                    setJoin(true);
                  } else if (username) {
                    setUsername(username);
                    setJoin(true);
                  } else {
                    return swal('Please choose a username or sign in to continue');
                  }
                }}
                style={{ width: '9rem' }}
              >
                Join Chat!
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ChatPage;
