import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Star } from '@material-ui/icons';
import {
  Container,
  TextField,
  Button,
  IconButton,
  FormControlLabel,
  FormGroup,
  Switch,
  Modal,
  Box,
} from '@material-ui/core';

const HomePage = ({ favorites, addFavorite, removeFavorite }) => {
  // States
  const [loading, setLoading] = useState(true);
  const [imgs, setImgs] = useState(null);
  const [filteredImgs, setFilteredImgs] = useState(null);
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(null);
  const [form, setForm] = useState({
    search: '',
    showFavoriteOnly: false,
  });

  // Async
  const getImages = async () => {
    try {
      const res = await axios.get(
        'https://jsonplaceholder.typicode.com/albums/1/photos'
      );
      setImgs(res.data);
      setFilteredImgs(res.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  // Handlers
  const handleChangeForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeToggle = (e) => {
    handleShowFavoritesOnly(e.target.checked);
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    });
  };

  const handleShowFavoritesOnly = (isTrue) => {
    if (!isTrue) {
      handleSearch();
      return;
    }
    setFilteredImgs(imgs.filter(({ id }) => favorites.includes(id)));
  };

  const handleSearch = () => {
    setFilteredImgs(
      imgs.filter(({ id, title }) => {
        if (!form.showFavoriteOnly) return title.includes(form.search);
        return title.includes(form.search) && favorites.includes(id);
      })
    );
  };

  const handleContentModal = (id, title, url) => {
    setContent({
      id,
      title,
      url,
    });
    setOpen(true);
  };

  // Renders
  const renderImgs = () =>
    filteredImgs.map(({ id, thumbnailUrl, title, url }) => (
      <div
        key={id}
        style={{
          marginBottom: 12,
          padding: '0px 12px 0 12px',
          position: 'relative',
          width: 'calc(25% - 24px)',
        }}
      >
        <div onClick={() => handleContentModal(id, title, url)}>
          <img
            srcSet={thumbnailUrl}
            alt={title}
            loading="lazy"
            style={{
              width: '100%',
            }}
          />
        </div>
        {favorites.includes(id) ? (
          <IconButton
            aria-label="favorite"
            onClick={() => removeFavorite(id)}
            color="secondary"
            style={{
              position: 'absolute',
              top: 0,
              right: 12,
              zIndex: 1,
            }}
          >
            <Star />
          </IconButton>
        ) : (
          <IconButton
            aria-label="favorite"
            onClick={() => addFavorite(id)}
            style={{
              position: 'absolute',
              top: 0,
              right: 12,
              zIndex: 1,
            }}
          >
            <Star />
          </IconButton>
        )}
      </div>
    ));
  return (
    <Container>
      <div
        style={{
          display: 'flex',
          marginTop: 24,
        }}
      >
        <TextField
          label="Search"
          size="small"
          name="search"
          fullWidth
          style={{
            marginRight: 24,
          }}
          onChange={handleChangeForm}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </div>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={form.showFavoriteOnly}
              name="showFavoriteOnly"
              onChange={handleChangeToggle}
            />
          }
          label="Show Favorites Only."
          style={{
            margin: '24px 0 24px auto',
            width: 'fit-content',
          }}
        />
      </FormGroup>
      {!loading ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            margin: '24px -12px 24px -12px',
          }}
        >
          {renderImgs()}
        </div>
      ) : (
        <div>Loading</div>
      )}
      {content && (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 1000,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              <div
                style={{
                  marginRight: 12,
                  width: '50%',
                }}
              >
                <img
                  src={content.url}
                  alt={content.title}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                  }}
                />
              </div>
              <div
                style={{
                  marginLeft: 12,
                  width: '50%',
                }}
              >
                {favorites.includes(content.id) ? (
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <IconButton
                      aria-label="favorite"
                      onClick={() => removeFavorite(content.id)}
                      color="secondary"
                    >
                      <Star />
                    </IconButton>
                    <div style={{ marginLeft: 24 }} z>
                      Remove From Your Favorites
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    <IconButton
                      aria-label="favorite"
                      onClick={() => addFavorite(content.id)}
                    >
                      <Star />
                    </IconButton>
                    <div style={{ marginLeft: 24 }}>Add To Your Favorites</div>
                  </div>
                )}
                <div>{content.title}</div>
              </div>
            </div>
          </Box>
        </Modal>
      )}
    </Container>
  );
};

const mapStateToProps = (state) => ({
  favorites: state.favorites,
});

const mapDispatchToProps = (dispatch) => {
  return {
    addFavorite: (id) =>
      dispatch({
        type: 'ADD_FAVORITE',
        payloads: { id },
      }),
    removeFavorite: (id) =>
      dispatch({
        type: 'REMOVE_FAVORITE',
        payloads: { id },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
