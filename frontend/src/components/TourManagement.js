import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, TablePagination, InputAdornment } from '@mui/material';
import { Edit, Delete, Add, CloudUpload, Search } from '@mui/icons-material';
import { tourAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const TourManagement = () => {
  const { isAdmin } = useAuth();
  const [tours, setTours] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentTour, setCurrentTour] = useState({
    id: null,
    title: '',
    description: '',
    price: '',
    price_usd: '',
    duration: '',
    category: '',
    image_url: '',
    getyourguide_url: '',
    highlights: '',
    includes: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    fetchTours();
  }, [page, rowsPerPage, searchQuery]);

  const fetchTours = async () => {
    try {
      const response = await tourAPI.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery
      });
      setTours(response.data.data);
      setTotalCount(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching tours:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleOpen = (tour = null) => {
    if (tour) {
      setEditMode(true);
      const highlights = typeof tour.highlights === 'string' ? tour.highlights : JSON.stringify(tour.highlights, null, 2);
      const includes = typeof tour.includes === 'string' ? tour.includes : JSON.stringify(tour.includes, null, 2);
      setCurrentTour({
        ...tour,
        highlights,
        includes,
      });
    } else {
      setEditMode(false);
      setCurrentTour({
        id: null,
        title: '',
        description: '',
        price: '',
        price_usd: '',
        duration: '',
        category: '',
        image_url: '',
        getyourguide_url: '',
        highlights: '[]',
        includes: '[]',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMessage({ type: '', text: '' });
  };

  const handleChange = (e) => {
    setCurrentTour({ ...currentTour, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/upload/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setCurrentTour({ ...currentTour, image_url: response.data.imageUrl });
      setMessage({ type: 'success', text: 'Image uploaded successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Image upload failed!' });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const tourData = {
        ...currentTour,
        highlights: JSON.parse(currentTour.highlights),
        includes: JSON.parse(currentTour.includes),
      };

      if (editMode) {
        await tourAPI.update(currentTour.id, tourData);
        setMessage({ type: 'success', text: 'Tour updated successfully!' });
      } else {
        await tourAPI.create(tourData);
        setMessage({ type: 'success', text: 'Tour created successfully!' });
      }

      fetchTours();
      setTimeout(() => handleClose(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Operation failed. Please check your input.' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await tourAPI.delete(id);
        fetchTours();
      } catch (error) {
        console.error('Error deleting tour:', error);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, gap: 2 }}>
        <TextField
          placeholder="Search tours..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          sx={{ flexGrow: 1, maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add New Tour
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price (QAR)</TableCell>
              <TableCell>Price (USD)</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>{tour.title}</TableCell>
                <TableCell>{tour.category}</TableCell>
                <TableCell>{tour.price}</TableCell>
                <TableCell>{tour.price_usd || '-'}</TableCell>
                <TableCell>{tour.duration}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(tour)}>
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton color="error" onClick={() => handleDelete(tour.id)}>
                      <Delete />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editMode ? 'Edit Tour' : 'Add New Tour'}</DialogTitle>
        <DialogContent>
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}
          <TextField fullWidth label="Title" name="title" value={currentTour.title} onChange={handleChange} sx={{ mb: 2, mt: 1 }} />
          <TextField fullWidth label="Description" name="description" value={currentTour.description} onChange={handleChange} multiline rows={3} sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Price (QAR)" name="price" type="number" value={currentTour.price} onChange={handleChange} />
            <TextField fullWidth label="Price (USD)" name="price_usd" type="number" value={currentTour.price_usd || ''} onChange={handleChange} placeholder="Optional" />
          </Box>
          <TextField fullWidth label="Duration" name="duration" value={currentTour.duration} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="Category" name="category" value={currentTour.category} onChange={handleChange} sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
              <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
            </Button>
            {currentTour.image_url && (
              <Box sx={{ mt: 1 }}>
                <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'}${currentTour.image_url}`} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
              </Box>
            )}
          </Box>
          
          <TextField fullWidth label="Image URL (or upload above)" name="image_url" value={currentTour.image_url} onChange={handleChange} sx={{ mb: 2 }} />
          <TextField fullWidth label="GetYourGuide URL (optional)" name="getyourguide_url" value={currentTour.getyourguide_url || ''} onChange={handleChange} sx={{ mb: 2 }} placeholder="https://www.getyourguide.com/..." />
          <TextField fullWidth label="Highlights (JSON Array)" name="highlights" value={currentTour.highlights} onChange={handleChange} multiline rows={3} sx={{ mb: 2 }} />
          <TextField fullWidth label="Includes (JSON Array)" name="includes" value={currentTour.includes} onChange={handleChange} multiline rows={3} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TourManagement;
