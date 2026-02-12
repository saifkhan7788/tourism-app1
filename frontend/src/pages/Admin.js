import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TourManagement from '../components/TourManagement';
import BookingManagement from '../components/BookingManagement';
import UserManagement from '../components/UserManagement';
import ContactManagement from '../components/ContactManagement';
import GalleryManagement from '../components/GalleryManagement';
import AnnouncementManagement from '../components/AnnouncementManagement';
import SettingsManagement from '../components/SettingsManagement';

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const { isAuthenticated, loading, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" gutterBottom fontWeight={700} color="primary">
        Admin Dashboard
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Tours" />
          <Tab label="Bookings" />
          <Tab label="Messages" />
          <Tab label="Gallery" />
          <Tab label="Announcements" />
          {isAdmin && <Tab label="Settings" />}
          {isAdmin && <Tab label="Users" />}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && <TourManagement />}
          {tabValue === 1 && <BookingManagement />}
          {tabValue === 2 && <ContactManagement />}
          {tabValue === 3 && <GalleryManagement />}
          {tabValue === 4 && <AnnouncementManagement />}
          {tabValue === 5 && isAdmin && <SettingsManagement />}
          {tabValue === 6 && isAdmin && <UserManagement />}
        </Box>
      </Paper>
    </Container>
  );
};

export default Admin;
