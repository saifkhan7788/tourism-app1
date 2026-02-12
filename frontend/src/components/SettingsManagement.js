import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Grid } from '@mui/material';
import { Save } from '@mui/icons-material';
import axios from 'axios';

const SettingsManagement = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/settings`);
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:3001/api'}/settings`, settings, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Site Settings</Typography>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Facebook URL" value={settings.facebook_url || ''} onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Instagram URL" value={settings.instagram_url || ''} onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="WhatsApp Number" value={settings.whatsapp_number || ''} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Company Phone" value={settings.company_phone || ''} onChange={(e) => setSettings({ ...settings, company_phone: e.target.value })} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField fullWidth label="Company Email" value={settings.company_email || ''} onChange={(e) => setSettings({ ...settings, company_email: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <TextField fullWidth label="Company Address" value={settings.company_address || ''} onChange={(e) => setSettings({ ...settings, company_address: e.target.value })} />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsManagement;
