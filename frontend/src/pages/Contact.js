import React, { useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, TextField, Button, Alert } from '@mui/material';
import { Phone, Email, LocationOn } from '@mui/icons-material';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactAPI.create(formData);
      setAlert({ show: true, type: 'success', message: 'Thank you for contacting us! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setAlert({ show: true, type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700} color="primary">
        Contact Us
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Get in touch with us for any inquiries
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Phone color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Phone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                +974 7780 7165
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <Email color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                info@arabianadventure.com
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', textAlign: 'center' }}>
            <CardContent>
              <LocationOn color="primary" sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Location
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Doha, Qatar
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 6 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Send us a Message
          </Typography>
          {alert.show && (
            <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert({ ...alert, show: false })}>
              {alert.message}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Name" name="name" value={formData.name} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Message" name="message" multiline rows={4} value={formData.message} onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" size="large">
                  Send Message
                </Button>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Contact;
