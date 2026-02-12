import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Switch, FormControlLabel, TablePagination } from '@mui/material';
import { Delete, Edit, Add, CloudUpload, Search } from '@mui/icons-material';
import { galleryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const GalleryManagement = () => {
  const { isAdmin } = useAuth();
  const [images, setImages] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [formData, setFormData] = useState({ id: null, image_url: '', title: '', description: '', display_order: 0, is_active: 1 });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await galleryAPI.getAll();
      setImages(response.data.data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleOpen = (image = null) => {
    if (image) {
      setEditMode(true);
      setFormData(image);
    } else {
      setEditMode(false);
      setFormData({ id: null, image_url: '', title: '', description: '', display_order: 0, is_active: 1 });
    }
    setDialog(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/upload/image`, formDataUpload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, image_url: response.data.imageUrl });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editMode) {
        await galleryAPI.update(formData.id, formData);
      } else {
        await galleryAPI.create(formData);
      }
      fetchImages();
      setDialog(false);
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (image) => {
    setSelectedImage(image);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await galleryAPI.delete(selectedImage.id);
      fetchImages();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting image:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = images.filter(image =>
    (image.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (image.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by title or description..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          sx={{ width: 400 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Carousel Image
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredImages.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((image) => (
              <TableRow key={image.id}>
                <TableCell>
                  <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'}${image.image_url}`} alt={image.title} style={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 4 }} />
                </TableCell>
                <TableCell>{image.title}</TableCell>
                <TableCell>{image.description?.substring(0, 50)}...</TableCell>
                <TableCell>{image.display_order}</TableCell>
                <TableCell>{image.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(image)} size="small">
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton color="error" onClick={() => handleDeleteClick(image)} size="small">
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
        count={filteredImages.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit' : 'Add'} Carousel Image</DialogTitle>
        <DialogContent>
          <Button component="label" variant="outlined" startIcon={<CloudUpload />} disabled={uploading} sx={{ mt: 2, mb: 2 }}>
            {uploading ? 'Uploading...' : 'Upload Image'}
            <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
          </Button>
          {formData.image_url && (
            <Box sx={{ mb: 2 }}>
              <img src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'}${formData.image_url}`} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
            </Box>
          )}
          <TextField fullWidth label="Image URL" value={formData.image_url} onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" multiline rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Display Order" type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })} sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={formData.is_active === 1} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !formData.image_url}>
            {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Image</DialogTitle>
        <DialogContent>Are you sure you want to delete this carousel image?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GalleryManagement;
