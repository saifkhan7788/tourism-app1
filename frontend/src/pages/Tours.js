import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, CircularProgress } from '@mui/material';
import TourCard from '../components/TourCard';
import { tourAPI } from '../services/api';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const response = await tourAPI.getAll();
      setTours(response.data.data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight={700} color="primary">
          All Tours
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Explore our complete collection of premium experiences
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <TourCard tour={tour} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Tours;
