import React, { useEffect, useState } from 'react';

import Layout from '../components/Layout';
import '../assets/styles/Home.css';
import Table from 'react-bootstrap/table';
import FormControl from 'react-bootstrap/FormControl';
import FormSelect from 'react-bootstrap/FormSelect';
import { BsInfoCircle } from 'react-icons/bs';
import swal from 'sweetalert';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { refreshToken } from '../helper/refreshToken';
import jwt_decode from 'jwt-decode';

const Home = () => {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user);
  const [productList, setProductList] = useState([]);
  const [editID, setEditID] = useState(0);
  const [editData, setEditData] = useState({
    name: '',
    price: 0,
    category: '',
  });
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    category: '',
  });

  const editHandler = (e) => {
    const name = e.target.id;
    const value = e.target.value;

    setEditData({ ...editData, [name]: value });
  };

  const productHandler = (e) => {
    const name = e.target.id;
    const value = e.target.value;

    setProductData({ ...productData, [name]: value });
  };

  const fetchProductData = async () => {
    try {
      const response = await Axios.get(`${API_URL}/products`);
      setProductList(response.data);
    } catch (err) {
      alert(err);
    }
  };

  const AxiosJWT = Axios.create();

  AxiosJWT.interceptors.request.use(
    async (config) => {
      const currentTime = new Date().getTime();
      const decodedToken = jwt_decode(userGlobal.token);

      if (decodedToken.exp * 1000 < currentTime) {
        const newToken = await refreshToken(dispatch);
        config.headers['Authorization'] = `Bearer ${newToken.token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const renderProductList = () => {
    return productList.map((product, index) => {
      if (product.idproducts === editID) {
        return (
          <tr key={product.idproducts}>
            <td>{index + 1}</td>
            <td>
              <FormControl id="name" type="text" value={editData.name} onChange={editHandler} />
            </td>
            <td>
              <FormControl id="price" type="price" value={editData.price} onChange={editHandler} />
            </td>
            <td>
              <FormSelect value={editData.category} id="category" onChange={editHandler}>
                <option value="">Choose Category</option>
                <option value={'Electronics'}>Electronics</option>
                <option value={'Fashion'}>Fashion</option>
                <option value={'Toys'}>Toys</option>
                <option value={'Games'}>Games</option>
                <option value={'Accessories'}>Accessories</option>
              </FormSelect>
            </td>
            <td className="text-center">
              <button
                className="btn btn-success"
                onClick={() => {
                  editProducts(product.idproducts);
                }}
              >
                Save
              </button>
            </td>
            <td className="text-center">
              <button
                className="btn btn-danger btn-block"
                onClick={() => {
                  setEditID(0);
                }}
              >
                Cancel
              </button>
            </td>
          </tr>
        );
      } else {
        return (
          <tr key={product.idproducts}>
            <td>{index + 1}</td>
            <td>{product.name}</td>
            <td>Rp. {product.price.toLocaleString('id')}</td>
            <td>{product.category}</td>
            <td className="text-center">
              <button
                className="btn btn-warning"
                onClick={() => {
                  setEditID(product.idproducts);
                  setEditData({
                    name: product.name,
                    price: product.price,
                    category: product.category,
                  });
                }}
              >
                Edit
              </button>
            </td>
            <td className="text-center">
              <button
                className="btn btn-danger btn-block"
                onClick={() => {
                  deleteProducts(product.idproducts);
                }}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      }
    });
  };

  const addProducts = () => {
    if (!userGlobal) {
      return swal('Sorry', `You don't have the authorization to perform this action`, 'warning');
    } else if (!productData.name) {
      return swal('Oops', 'Product name cannot be empty!', 'warning');
    } else if (productData.price === '' || productData.price == '0') {
      return swal('Oops', 'Product price cannot be zero!', 'warning');
    } else if (!productData.category) {
      return swal('Oops', 'Please choose your product category!', 'warning');
    } else {
      AxiosJWT.post(
        `${API_URL}/products/add`,
        {
          ...productData,
          price: parseInt(productData.price),
        },
        {
          headers: {
            Authorization: `Bearer ${userGlobal.token}`,
          },
        }
      )
        .then(() => {
          fetchProductData();
          swal('Success!', 'Added Product to Database!', 'success');
        })
        .catch((err) => {
          alert(err);
        });
    }
    setProductData({
      name: '',
      price: '',
      category: '',
    });
  };

  const editProducts = (id) => {
    if (!userGlobal.token) {
      swal('Sorry', `You don't have access to perform this action`, 'warning');
    } else {
      AxiosJWT.patch(
        `${API_URL}/products/edit/${id}`,
        {
          ...editData,
          price: parseInt(editData.price),
        },
        {
          headers: {
            Authorization: `Bearer ${userGlobal.token}`,
          },
        }
      )
        .then(() => {
          swal('Success!', 'Updated Product Data', 'success');
          fetchProductData();
        })
        .catch((err) => {
          alert(err);
        });
    }
    setEditID(0);
  };

  const deleteProducts = (id) => {
    if (!userGlobal.token) {
      swal('Sorry', `You don't have access to perform this action`, 'warning');
    } else {
      AxiosJWT.post(
        `${API_URL}/products/delete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userGlobal.token}`,
          },
        }
      )
        .then(() => {
          swal('Success', 'Deleted Product from Database!', 'success');
          fetchProductData();
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return (
    <Layout>
      <div className="home-main-container">
        <div className="home-main-banner">
          <div className="home-banner-blue-line" />
          <BsInfoCircle className="me-2" />
          <span className="me-1">Try our new ChatPage feature?</span>
          <Link to="/chatpage">Yes, please!</Link>
        </div>
        <div className="home-product-data-header">
          <span>Product Data</span>
        </div>
        <div className="home-product-data-content container">
          <Table striped bordered hover variant="dark">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
                <th>Category</th>
                <th colSpan={2} className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {renderProductList()}
              <tr>
                <td>#</td>
                <td>
                  <FormControl
                    type="text"
                    placeholder="Insert product name.."
                    disabled={editID}
                    id="name"
                    onChange={productHandler}
                    value={productData.name}
                  />
                </td>
                <td>
                  <FormControl
                    type="number"
                    placeholder="Insert product price.."
                    disabled={editID}
                    id="price"
                    onChange={productHandler}
                    value={productData.price}
                  />
                </td>
                <td>
                  <FormSelect disabled={editID} id="category" onChange={productHandler} value={productData.category}>
                    <option value="">Choose Category</option>
                    <option value={'Electronics'}>Electronics</option>
                    <option value={'Fashion'}>Fashion</option>
                    <option value={'Toys'}>Toys</option>
                    <option value={'Games'}>Games</option>
                    <option value={'Accessories'}>Accessories</option>
                  </FormSelect>
                </td>
                <td colSpan={2} className="text-center">
                  <button className="btn btn-success" onClick={addProducts}>
                    Submit
                  </button>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
