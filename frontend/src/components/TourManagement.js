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
    original_price: '',
    original_price_usd: '',
    discount_percentage: 0,
    duration: '',
    category: '',
    image_url: '',
    gallery_images: [],
    highlights: '',
    includes: '',
    free_cancellation: true,
    cancellation_hours: 24,
    reserve_now_pay_later: true,
    min_participants: 1,
    max_participants: 50,
    adult_age_min: 12,
    adult_age_max: 99,
    child_age_min: 3,
    child_age_max: 11,
    infant_age_max: 2,
    languages: '',
    pickup_included: true,
    pickup_details: 'Pickup from any location in Doha City',
    private_group_available: true,
    transport_rating: 92,
    starting_times: '',
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
      const languages = typeof tour.languages === 'string' ? tour.languages : JSON.stringify(tour.languages || ['English'], null, 2);
      const starting_times = typeof tour.starting_times === 'string' ? tour.starting_times : JSON.stringify(tour.starting_times || ['09:00', '14:00', '18:00'], null, 2);
      const gallery_images = typeof tour.gallery_images === 'string' ? JSON.parse(tour.gallery_images) : (tour.gallery_images || []);
      setCurrentTour({
        ...tour,
        highlights,
        includes,
        languages,
        starting_times,
        gallery_images,
        original_price: tour.original_price || '',
        original_price_usd: tour.original_price_usd || '',
        discount_percentage: tour.discount_percentage || 0,
        free_cancellation: tour.free_cancellation !== false,
        cancellation_hours: tour.cancellation_hours || 24,
        reserve_now_pay_later: tour.reserve_now_pay_later !== false,
        pickup_included: tour.pickup_included !== false,
        pickup_details: tour.pickup_details || 'Pickup from any location in Doha City',
        private_group_available: tour.private_group_available !== false,
        transport_rating: tour.transport_rating || 92,
        adult_age_min: tour.adult_age_min || 12,
        adult_age_max: tour.adult_age_max || 99,
        child_age_min: tour.child_age_min || 3,
        child_age_max: tour.child_age_max || 11,
        infant_age_max: tour.infant_age_max || 2,
      });
    } else {
      setEditMode(false);
      setCurrentTour({
        id: null,
        title: '',
        description: '',
        price: '',
        price_usd: '',
        original_price: '',
        original_price_usd: '',
        discount_percentage: 0,
        duration: '',
        category: '',
        image_url: '',
        gallery_images: [],
        highlights: '[]',
        includes: '[]',
        free_cancellation: true,
        cancellation_hours: 24,
        reserve_now_pay_later: true,
        min_participants: 1,
        max_participants: 50,
        languages: '["English"]',
        pickup_included: true,
        pickup_details: 'Pickup from any location in Doha City',
        private_group_available: true,
        transport_rating: 92,
        starting_times: '["09:00", "14:00", "18:00"]',
        adult_age_min: 12,
        adult_age_max: 99,
        child_age_min: 3,
        child_age_max: 11,
        infant_age_max: 2,
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
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'https://tourism-app1-production.up.railway.app/api'}/upload/image`, formData, {
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

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await axios.post(`${process.env.REACT_APP_API_URL || 'https://tourism-app1-production.up.railway.app/api'}/upload/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(response.data.imageUrl);
      }
      setCurrentTour({ ...currentTour, gallery_images: [...currentTour.gallery_images, ...uploadedUrls] });
      setMessage({ type: 'success', text: `${uploadedUrls.length} images uploaded!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gallery upload failed!' });
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (index) => {
    const newGallery = currentTour.gallery_images.filter((_, i) => i !== index);
    setCurrentTour({ ...currentTour, gallery_images: newGallery });
  };

  const handleSubmit = async () => {
    try {
      const tourData = {
        ...currentTour,
        highlights: JSON.parse(currentTour.highlights),
        includes: JSON.parse(currentTour.includes),
        languages: JSON.parse(currentTour.languages),
        starting_times: JSON.parse(currentTour.starting_times),
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
            <TextField fullWidth label="Price (QAR)" name="price" type="number" value={currentTour.price} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">QAR</InputAdornment> }} />
            <TextField fullWidth label="Price (USD)" name="price_usd" type="number" value={currentTour.price_usd} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Original Price (QAR)" name="original_price" type="number" value={currentTour.original_price} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">QAR</InputAdornment> }} />
            <TextField fullWidth label="Original Price (USD)" name="original_price_usd" type="number" value={currentTour.original_price_usd} onChange={handleChange} InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Discount %" name="discount_percentage" type="number" value={currentTour.discount_percentage} onChange={handleChange} InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Duration" name="duration" value={currentTour.duration} onChange={handleChange} />
            <TextField fullWidth label="Category" name="category" value={currentTour.category} onChange={handleChange} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Min Participants" name="min_participants" type="number" value={currentTour.min_participants} onChange={handleChange} />
            <TextField fullWidth label="Max Participants" name="max_participants" type="number" value={currentTour.max_participants} onChange={handleChange} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Cancellation Hours" name="cancellation_hours" type="number" value={currentTour.cancellation_hours} onChange={handleChange} />
            <TextField fullWidth label="Transport Rating" name="transport_rating" type="number" value={currentTour.transport_rating} onChange={handleChange} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Adult Age Min" name="adult_age_min" type="number" value={currentTour.adult_age_min} onChange={handleChange} />
            <TextField fullWidth label="Adult Age Max" name="adult_age_max" type="number" value={currentTour.adult_age_max} onChange={handleChange} />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField fullWidth label="Child Age Min" name="child_age_min" type="number" value={currentTour.child_age_min} onChange={handleChange} />
            <TextField fullWidth label="Child Age Max" name="child_age_max" type="number" value={currentTour.child_age_max} onChange={handleChange} />
            <TextField fullWidth label="Infant Age Max" name="infant_age_max" type="number" value={currentTour.infant_age_max} onChange={handleChange} />
          </Box>
          <TextField fullWidth label="Pickup Details" name="pickup_details" value={currentTour.pickup_details} onChange={handleChange} sx={{ mb: 2 }} />
          
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
                <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${currentTour.image_url}`} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
              </Box>
            )}
          </Box>
          
          <TextField fullWidth label="Image URL (or upload above)" name="image_url" value={currentTour.image_url} onChange={handleChange} sx={{ mb: 2 }} />
          
          <Box sx={{ mb: 2 }}>
            <Button component="label" variant="outlined" startIcon={<CloudUpload />} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Gallery (Multiple)'}
              <input type="file" hidden accept="image/*" multiple onChange={handleGalleryUpload} />
            </Button>
            {currentTour.gallery_images && currentTour.gallery_images.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {currentTour.gallery_images.map((img, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${img}`} alt={`Gallery ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    <IconButton size="small" sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }} onClick={() => removeGalleryImage(index)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          <TextField fullWidth label="Languages (JSON Array)" name="languages" value={currentTour.languages} onChange={handleChange} sx={{ mb: 2 }} placeholder='["English", "Arabic"]' />
          <TextField fullWidth label="Starting Times (JSON Array)" name="starting_times" value={currentTour.starting_times} onChange={handleChange} sx={{ mb: 2 }} placeholder='["09:00", "14:00", "18:00"]' />
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
