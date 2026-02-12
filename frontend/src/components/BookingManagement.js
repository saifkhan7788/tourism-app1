import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, TablePagination, InputAdornment, IconButton } from '@mui/material';
import { Search, Delete } from '@mui/icons-material';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingManagement = () => {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [page, rowsPerPage, searchQuery]);

  const fetchBookings = async () => {
    try {
      const response = await bookingAPI.getAll({
        page: page + 1,
        limit: rowsPerPage,
        search: searchQuery
      });
      setBookings(response.data.data);
      setTotalCount(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleStatusChange = async (id, status) => {
    setSelectedBooking(id);
    setNewStatus(status);
    setOpenDialog(true);
  };

  const confirmStatusChange = async () => {
    setLoading(true);
    try {
      await bookingAPI.updateStatus(selectedBooking, newStatus, remarks);
      fetchBookings();
      setOpenDialog(false);
      setRemarks('');
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setBookingToDelete(id);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await bookingAPI.delete(bookingToDelete);
      fetchBookings();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting booking:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'success',
      cancelled: 'error',
      completed: 'info',
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <TextField
          placeholder="Search bookings by name, email, phone, or tour..."
          value={searchQuery}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          sx={{ maxWidth: 500 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Tour</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>People</TableCell>
              <TableCell>Total (QAR)</TableCell>
              <TableCell>Total (USD)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.id}</TableCell>
                <TableCell>
                  {booking.customer_name}
                  <br />
                  <small>{booking.customer_email}</small>
                  <br />
                  <small>{booking.customer_phone}</small>
                </TableCell>
                <TableCell>{booking.tour_title}</TableCell>
                <TableCell>{new Date(booking.booking_date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.number_of_people}</TableCell>
                <TableCell>{booking.total_price}</TableCell>
                <TableCell>{booking.total_price_usd || '-'}</TableCell>
                <TableCell>
                  <Select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  {isAdmin && (
                    <IconButton color="error" onClick={() => handleDeleteClick(booking.id)} size="small">
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
        rowsPerPageOptions={[5, 10, 25, 50]}
      />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Remarks (optional)"
            multiline
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add reason for cancellation or confirmation message..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={confirmStatusChange} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Booking</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this booking? This action cannot be undone.
        </DialogContent>
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

export default BookingManagement;
