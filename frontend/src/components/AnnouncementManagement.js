import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Switch, FormControlLabel, Chip, TablePagination } from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const AnnouncementManagement = () => {
  const { isAdmin } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState(null);
  const [formData, setFormData] = useState({ id: null, message: '', type: 'offer', background_color: '#FFD700', text_color: '#8B1538', is_active: 1, start_date: '', end_date: '' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/announcements', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleOpen = (item = null) => {
    if (item) {
      setEditMode(true);
      // Convert date format from YYYY-MM-DD to input format
      const startDate = item.start_date ? item.start_date.split('T')[0] : '';
      const endDate = item.end_date ? item.end_date.split('T')[0] : '';
      setFormData({
        ...item,
        start_date: startDate,
        end_date: endDate
      });
    } else {
      setEditMode(false);
      setFormData({ id: null, message: '', type: 'offer', background_color: '#FFD700', text_color: '#8B1538', is_active: 1, start_date: '', end_date: '' });
    }
    setDialog(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (editMode) {
        await axios.put(`http://localhost:3001/api/announcements/${formData.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:3001/api/announcements', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      fetchAnnouncements();
      setDialog(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setSelected(item);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/announcements/${selected.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnnouncements();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = announcements.filter(item =>
    item.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by message or type..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          sx={{ width: 400 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Announcement
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Message</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAnnouncements.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.message}</TableCell>
                <TableCell><Chip label={item.type} size="small" /></TableCell>
                <TableCell>{item.is_active ? 'Yes' : 'No'}</TableCell>
                <TableCell>{item.start_date || '-'}</TableCell>
                <TableCell>{item.end_date || '-'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleOpen(item)} size="small">
                    <Edit />
                  </IconButton>
                  {isAdmin && (
                    <IconButton color="error" onClick={() => handleDeleteClick(item)} size="small">
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
        count={filteredAnnouncements.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit' : 'Add'} Announcement</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} sx={{ mt: 2, mb: 2 }} multiline rows={2} />
          <TextField fullWidth select label="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} sx={{ mb: 2 }}>
            <MenuItem value="offer">Offer/Discount</MenuItem>
            <MenuItem value="news">News</MenuItem>
            <MenuItem value="alert">Alert</MenuItem>
          </TextField>
          <TextField fullWidth label="Background Color" value={formData.background_color} onChange={(e) => setFormData({ ...formData, background_color: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Text Color" value={formData.text_color} onChange={(e) => setFormData({ ...formData, text_color: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Start Date" type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <TextField fullWidth label="End Date" type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
          <FormControlLabel control={<Switch checked={formData.is_active === 1} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} />} label="Active" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={loading || !formData.message}>
            {loading ? 'Saving...' : editMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Announcement</DialogTitle>
        <DialogContent>Are you sure you want to delete this announcement?</DialogContent>
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

export default AnnouncementManagement;
