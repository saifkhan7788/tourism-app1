import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Select, MenuItem, TextField, TablePagination } from '@mui/material';
import { Delete, Visibility, Reply, Search } from '@mui/icons-material';
import { contactAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ContactManagement = () => {
  const { isAdmin } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [viewDialog, setViewDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [replyDialog, setReplyDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await contactAPI.getAll();
      setContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleViewClick = async (contact) => {
    setSelectedContact(contact);
    setViewDialog(true);
    if (contact.status === 'new') {
      await contactAPI.updateStatus(contact.id, 'read');
      fetchContacts();
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      fetchContacts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteClick = (contact) => {
    setSelectedContact(contact);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await contactAPI.delete(selectedContact.id);
      fetchContacts();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleReplyClick = (contact) => {
    setSelectedContact(contact);
    setReplyMessage('');
    setReplyDialog(true);
  };

  const handleSendReply = async () => {
    setLoading(true);
    try {
      await contactAPI.reply(selectedContact.id, replyMessage);
      fetchContacts();
      setReplyDialog(false);
      setReplyMessage('');
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { new: 'error', read: 'warning', replied: 'success' };
    return colors[status] || 'default';
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <TextField
          placeholder="Search by name, email, or subject..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          sx={{ width: 400 }}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredContacts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.id}</TableCell>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.email}</TableCell>
                <TableCell>{contact.subject}</TableCell>
                <TableCell>
                  <Select
                    value={contact.status}
                    onChange={(e) => handleStatusChange(contact.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="read">Read</MenuItem>
                    <MenuItem value="replied">Replied</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>{new Date(contact.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleViewClick(contact)} size="small">
                    <Visibility />
                  </IconButton>
                  <IconButton color="success" onClick={() => handleReplyClick(contact)} size="small" disabled={contact.status === 'replied'}>
                    <Reply />
                  </IconButton>
                  {isAdmin && (
                    <IconButton color="error" onClick={() => handleDeleteClick(contact)} size="small">
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
        count={filteredContacts.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Contact Message</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Name:</Typography>
            <Typography variant="body1">{selectedContact?.name}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Email:</Typography>
            <Typography variant="body1">{selectedContact?.email}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Subject:</Typography>
            <Typography variant="body1">{selectedContact?.subject}</Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Message:</Typography>
            <Typography variant="body1">{selectedContact?.message}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">Date:</Typography>
            <Typography variant="body1">{new Date(selectedContact?.created_at).toLocaleString()}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Contact</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this contact message?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={replyDialog} onClose={() => setReplyDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reply to {selectedContact?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Original Message:</Typography>
            <Typography variant="body2" sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              {selectedContact?.message}
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="Your Reply"
            multiline
            rows={6}
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Type your reply here..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSendReply} variant="contained" disabled={!replyMessage.trim() || loading}>
            {loading ? 'Sending...' : 'Send Reply'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContactManagement;
