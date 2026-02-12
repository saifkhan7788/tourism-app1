import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Instagram, WhatsApp } from '@mui/icons-material';
import axios from 'axios';

const Footer = () => {
  const [settings, setSettings] = useState({});

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
  return (
    <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 6, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Arabian Adventure
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Your premier destination for unforgettable experiences in Qatar. Explore the best tours and adventures with us.
            </Typography>
            <Box>
              {settings.facebook_url && (
                <IconButton color="inherit" component="a" href={settings.facebook_url} target="_blank">
                  <Facebook />
                </IconButton>
              )}
              {settings.instagram_url && (
                <IconButton color="inherit" component="a" href={settings.instagram_url} target="_blank">
                  <Instagram />
                </IconButton>
              )}
              {settings.whatsapp_number && (
                <IconButton color="inherit" component="a" href={`https://wa.me/${settings.whatsapp_number}`} target="_blank">
                  <WhatsApp />
                </IconButton>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" color="inherit" underline="hover">Home</Link>
              <Link href="/tours" color="inherit" underline="hover">Tours</Link>
              <Link href="/about" color="inherit" underline="hover">About Us</Link>
              <Link href="/contact" color="inherit" underline="hover">Contact</Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom fontWeight={700}>
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📞 Phone: {settings.company_phone || '+974 7780 7165'}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              📧 Email: {settings.company_email || 'info@arabianadventure.com'}
            </Typography>
            <Typography variant="body2">
              📍 Address: {settings.company_address || 'Doha, Qatar'}
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.2)', mt: 4, pt: 3, textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Arabian Adventure. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
