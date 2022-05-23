import { useState, useEffect } from 'react';

import Layout from '../components/Layout';
import '../assets/styles/Upload.css';
import Form from 'react-bootstrap/Form';
import swal from 'sweetalert';
import { toast } from 'react-toastify';

import Axios from 'axios';
import { API_URL } from '../assets/constants';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const navigate = useNavigate();
  const [albumsList, setAlbumsList] = useState([]);
  const [albumData, setAlbumData] = useState({
    title: '',
    description: '',
    artist: '',
  });
  const [albumImage, setAlbumImage] = useState();

  const inputHandler = (e) => {
    setAlbumData({ ...albumData, [e.target.id]: e.target.value });
  };

  const addImageHandler = (e) => {
    setAlbumImage(e.target.files[0]);
  };

  const uploadHandler = async () => {
    if (!albumData.title || !albumData.description || !albumData.artist || !albumImage) {
      return swal('Welp..', 'Please complete your upload file data', 'warning');
    } else {
      let formData = new FormData();

      formData.append('data', JSON.stringify(albumData));
      formData.append('file', albumImage);

      try {
        const response = await Axios.post(`${API_URL}/upload/albums`, formData);
        setAlbumsList(response.data.result);
        setAlbumData({
          title: '',
          description: '',
          artist: '',
        });
        document.getElementById('image').value = null;
        setAlbumImage();
        swal(response.data.message);
      } catch (err) {
        alert(err);
      }
    }
  };

  const renderAlbums = () => {
    return albumsList.map((album) => {
      return (
        <div className="upload-albums-container" key={album.idalbum}>
          <div className="upload-album-image-container">
            <div className="album-image-container">
              <img src={`${API_URL}/public/${album.image}`} />
            </div>
          </div>
          <div className="upload-album-info-container">
            <span className="album-info-title">{album.title}</span>
            <span className="album-info-artist">{album.artist}</span>
          </div>
          <div className="upload-album-description-container">
            <div className="album-description-text-container">
              <span>{album.description}</span>
            </div>
          </div>
        </div>
      );
    });
  };

  const fetchAlbumsList = async () => {
    try {
      const response = await Axios.get(`${API_URL}/upload/albums`);
      setAlbumsList(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('refreshToken')) {
      navigate('/', { replace: true });
      swal(`Please sign in to access this page`);
    } else {
      fetchAlbumsList();
    }
  }, []);

  return (
    <Layout>
      <div className="upload-page-body">
        <div className="upload-page-header-container">
          <span>Upload Albums</span>
        </div>
        <div className="upload-page-action-container">
          <div className="upload-page-input-container">
            <div className="upload-page-input">
              <label htmlFor="title">Title</label>
              <Form.Control type="text" id="title" onChange={inputHandler} maxLength={45} value={albumData.title} />
            </div>
            <div className="upload-page-input">
              <label htmlFor="artist">Artist</label>
              <Form.Control type="text" id="artist" onChange={inputHandler} maxLength={45} value={albumData.artist} />
            </div>
            <div className="upload-page-input input-tall">
              <label htmlFor="title">Description</label>
              <Form.Control
                as="textarea"
                id="description"
                style={{ height: '7rem' }}
                onChange={inputHandler}
                maxLength={245}
                value={albumData.description}
              />
            </div>
            <div className="upload-page-input">
              <label htmlFor="image">Image</label>
              <Form.Control type="file" id="image" onChange={addImageHandler} />
            </div>
            <button className="btn btn-success mt-2" style={{ width: '8rem' }} onClick={uploadHandler}>
              Upload
            </button>
          </div>
          <div className="upload-page-divider" />
          <div className="upload-page-image-container">
            <div className="upload-page-image">
              {albumImage ? (
                <img className="upload-image" id="image-preview" src={URL.createObjectURL(albumImage)} />
              ) : (
                <span>No image to preview</span>
              )}
            </div>
          </div>
        </div>
        <div className="upload-page-header-container">
          <span>Albums Collection</span>
        </div>
        <div className="upload-page-albums-container">{renderAlbums()}</div>
      </div>
    </Layout>
  );
};

export default Upload;
