import Layout from '../components/Layout';
import '../assets/styles/Adminusers.css';
import Table from 'react-bootstrap/Table';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';

import { useEffect, useState } from 'react';
import Axios from 'axios';
import { MONGO_DB_URL } from '../assets/constants';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshToken } from '../helper/refreshToken';
import jwt_decode from 'jwt-decode';

const Adminusers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userGlobal = useSelector((state) => state.user);
  const [usersList, setUsersList] = useState([]);
  const [usersEdit, setUsersEdit] = useState({});
  const [usersAdd, setUserAdd] = useState({
    name: '',
    origin: '',
    occupation: '',
    address: '',
    age: '',
  });
  const [editID, setEditID] = useState('');
  const [search_query, setSQ] = useState();

  const AxiosJWT = Axios.create();

  AxiosJWT.interceptors.request.use(
    async (config) => {
      const currentDate = new Date();
      const decodedToken = jwt_decode(userGlobal.token);

      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        const newToken = await refreshToken(dispatch);
        config.headers['Authorization'] = `Bearer ${newToken.token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const fetchUsersList = async () => {
    try {
      const response = await Axios.get(`${MONGO_DB_URL}/users`);
      setUsersList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  const editHandler = (e) => {
    setUsersEdit({ ...usersEdit, [e.target.id]: e.target.value });
  };

  const inputHandler = (e) => {
    setUserAdd({ ...usersAdd, [e.target.name]: e.target.value });
  };

  const updateUser = async (id) => {
    try {
      await AxiosJWT.patch(`${MONGO_DB_URL}/users/edit/${id}`, usersEdit, {
        headers: {
          Authorization: `Bearer ${userGlobal.token}`,
        },
      });
      fetchUsersList();
      setEditID('');
      swal('Hooray!', 'Succesfully Update User', 'success');
    } catch (err) {
      console.log(err);
    }
  };

  const addUsers = async () => {
    try {
      await AxiosJWT.post(
        `${MONGO_DB_URL}/users/add`,
        {
          ...usersAdd,
          age: parseInt(usersAdd.age),
        },
        {
          headers: {
            Authorization: `Bearer ${userGlobal.token}`,
          },
        }
      );
      fetchUsersList();
      setUserAdd({
        name: '',
        origin: '',
        occupation: '',
        address: '',
        age: '',
      });
      swal('Hooray!', 'Succesfully Add User', 'success');
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await AxiosJWT.delete(
        `${MONGO_DB_URL}/users/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userGlobal.token}`,
          },
        }
      );
      await fetchUsersList();
      swal('Done!', 'Succesfully Delete User', 'success');
    } catch (err) {
      console.log(err);
    }
  };

  const searchHandler = async () => {
    if (!search_query) {
      return swal('Search filter cannot be empty');
    } else {
      try {
        const response = await Axios.post(`${MONGO_DB_URL}/users/filter`, search_query);
        setUsersList(response.data);
        document.getElementById('keyword').value = '';
        document.getElementById('sort').value = '';
        setSQ();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const resetFilterHandler = async () => {
    const response = await Axios.post(`${MONGO_DB_URL}/users/filter`, {});
    setUsersList(response.data);
    document.getElementById('keyword').value = '';
    document.getElementById('sort').value = '';
  };

  const renderUsers = () => {
    return usersList.map((user, index) => {
      if (editID == user._id) {
        return (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>
              <FormControl id="name" value={usersEdit.name} onChange={editHandler} />
            </td>
            <td>
              <FormControl id="origin" value={usersEdit.origin} onChange={editHandler} />
            </td>
            <td>
              <FormControl id="occupation" value={usersEdit.occupation} onChange={editHandler} />
            </td>
            <td>
              <FormControl id="address" value={usersEdit.address} onChange={editHandler} />
            </td>
            <td>
              <FormControl type="number" id="age" value={usersEdit.age} onChange={editHandler} />
            </td>
            <td>
              <button
                className="btn btn-warning"
                onClick={() => {
                  updateUser(user._id);
                }}
              >
                Save
              </button>
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => setEditID('')}>
                Cancel
              </button>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={user._id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.origin}</td>
            <td>{user.occupation}</td>
            <td>{user.address}</td>
            <td>{user.age}</td>
            <td>
              <button
                className="btn btn-warning"
                onClick={() => {
                  setEditID(user._id);
                  setUsersEdit({ name: user.name, origin: user.origin, occupation: user.occupation, address: user.address, age: user.age });
                }}
              >
                Edit
              </button>
            </td>
            <td>
              <button className="btn btn-danger" onClick={() => deleteUser(user._id)}>
                Delete
              </button>
            </td>
          </tr>
        );
      }
    });
  };

  useEffect(() => {
    if (userGlobal.role !== 'Admin' || !userGlobal) {
      navigate('/', { replace: true });
      alert('You dont have permission to access this page');
    } else {
      fetchUsersList();
    }
  }, []);

  return (
    <Layout>
      <div className="admin-users-page-body">
        <div className="admin-users-page-header">
          <span>Admin Users Page</span>
        </div>
        <div className="admin-users-page-filter">
          <FormControl
            type="text"
            id="keyword"
            placeholder="Search.."
            className="me-2"
            onChange={(e) => setSQ({ ...search_query, [e.target.id]: e.target.value })}
            style={{ width: '50%' }}
          />
          <Form.Select
            className="me-2"
            id="sort"
            onChange={(e) => setSQ({ ...search_query, [e.target.id]: e.target.value })}
            style={{ width: '30%' }}
          >
            <option value="">Sort By..</option>
            <optgroup label="Name">
              <option value="name-asc">Name - A to Z</option>
              <option value="name-dsc">Name - Z to A</option>
            </optgroup>
            <optgroup label="Origin">
              <option value="origin-asc">Origin - A to Z</option>
              <option value="origin-dsc">Origin - Z to A</option>
            </optgroup>
            <optgroup label="Occupation">
              <option value="occupation-asc">Occupation - A to Z</option>
              <option value="occupation-dsc">Occupation - Z to A</option>
            </optgroup>
            <optgroup label="Address">
              <option value="address-asc">Address - A to Z</option>
              <option value="address-dsc">Address - Z to A</option>
            </optgroup>
            <optgroup label="Age">
              <option value="age-asc">Age - Low to High</option>
              <option value="age-dsc">Age - High to Low</option>
            </optgroup>
          </Form.Select>
          <button
            className="btn btn-success"
            onClick={() => {
              searchHandler();
            }}
          >
            Seach
          </button>
          <button className="btn btn-danger ms-2" onClick={resetFilterHandler}>
            Reset
          </button>
        </div>
        <div className="admin-users-list-container">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Origin</th>
                <th>Occupation</th>
                <th>Address</th>
                <th>Age</th>
                <th colSpan={2}>Action</th>
              </tr>
            </thead>
            <tbody>
              {renderUsers()}
              <tr>
                <td>#</td>
                <td>
                  <FormControl name="name" placeholder="Insert name.." value={usersAdd.name} onChange={inputHandler} />
                </td>
                <td>
                  <FormControl name="origin" placeholder="Insert origin.." value={usersAdd.origin} onChange={inputHandler} />
                </td>
                <td>
                  <FormControl name="occupation" placeholder="Insert occupation.." value={usersAdd.occupation} onChange={inputHandler} />
                </td>
                <td>
                  <FormControl name="address" placeholder="Insert address.." value={usersAdd.address} onChange={inputHandler} />
                </td>
                <td>
                  <FormControl type="number " name="age" placeholder="Insert age.." value={usersAdd.age} onChange={inputHandler} />
                </td>
                <td colSpan={2} className="text-center">
                  <button className="btn btn-success" onClick={addUsers}>
                    Add Users
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      s
    </Layout>
  );
};

export default Adminusers;
