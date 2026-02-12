import React, { useState, useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, TablePagination } from '@mui/material';
import { Delete, Lock, Add, Edit, Search } from '@mui/icons-material';
import { authAPI } from '../services/api';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'manager' });
  const [editUser, setEditUser] = useState({ id: null, username: '', email: '', role: 'manager' });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await authAPI.getAllUsers();
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await authAPI.deleteUser(selectedUser.id);
      fetchUsers();
      setDeleteDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordClick = (user) => {
    setSelectedUser(user);
    setPasswordDialog(true);
  };

  const confirmPasswordChange = async () => {
    setLoading(true);
    try {
      await authAPI.updatePassword(selectedUser.id, newPassword);
      setPasswordDialog(false);
      setNewPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    setLoading(true);
    try {
      await authAPI.register(newUser);
      fetchUsers();
      setAddDialog(false);
      setNewUser({ username: '', email: '', password: '', role: 'manager' });
    } catch (error) {
      console.error('Error adding user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user) => {
    setEditUser({ id: user.id, username: user.username, email: user.email, role: user.role });
    setEditDialog(true);
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await authAPI.updateUser(editUser.id, { username: editUser.username, email: editUser.email, role: editUser.role });
      fetchUsers();
      setEditDialog(false);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          placeholder="Search by username, email, or role..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} /> }}
          sx={{ width: 400 }}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => setAddDialog(true)}>
          Add User
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditClick(user)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handlePasswordClick(user)} size="small">
                    <Lock />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDeleteClick(user)} size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
      />

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {selectedUser?.username}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={passwordDialog} onClose={() => setPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={confirmPasswordChange} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={addDialog} onClose={() => setAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleAddUser} variant="contained" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            value={editUser.username}
            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={editUser.email}
            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Role"
            value={editUser.role}
            onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpdateUser} variant="contained" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
