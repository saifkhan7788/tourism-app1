import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardContent, Button, TextField, Chip, CircularProgress, Alert } from '@mui/material';
import { AccessTime, AttachMoney, CheckCircle } from '@mui/icons-material';
import { tourAPI, bookingAPI } from '../services/api';

const TourDetail = () => {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState('QAR');
  const [bookingData, setBookingData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    booking_date: '',
    number_of_people: 1,
    special_requests: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    fetchTour();
  }, [id]);

  const fetchTour = async () => {
    try {
      const response = await tourAPI.getById(id);
      setTour(response.data.data);
    } catch (error) {
      console.error('Error fetching tour:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    try {
      const totalPriceQAR = tour.price * bookingData.number_of_people;
      const totalPriceUSD = tour.price_usd ? (tour.price_usd * bookingData.number_of_people) : null;
      
      await bookingAPI.create({
        ...bookingData,
        tour_id: tour.id,
        total_price: totalPriceQAR,
        total_price_usd: totalPriceUSD,
      });
      setBookingSuccess(true);
      setBookingData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: '',
        number_of_people: 1,
        special_requests: '',
      });
    } catch (error) {
      setBookingError('Booking failed. Please try again.');
    }
  };

  // Default images based on tour title/category
  const getDefaultImage = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('desert') || titleLower.includes('safari')) {
      return 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop';
    }
    if (titleLower.includes('jet ski') || titleLower.includes('water')) {
      return 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=800&h=600&fit=crop';
    }
    if (titleLower.includes('city') || titleLower.includes('doha')) {
      return 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop';
    }
    if (titleLower.includes('dhow') || titleLower.includes('cruise')) {
      return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop';
    }
    if (titleLower.includes('north') || titleLower.includes('zubarah')) {
      return 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop';
    }
    return 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=800&h=600&fit=crop';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tour) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h5">Tour not found</Typography>
      </Container>
    );
  }

  const highlights = typeof tour.highlights === 'string' ? JSON.parse(tour.highlights) : (tour.highlights || []);
  const includes = typeof tour.includes === 'string' ? JSON.parse(tour.includes) : (tour.includes || []);

  const getPrice = () => {
    if (currency === 'USD' && tour.price_usd) {
      return parseFloat(tour.price_usd).toFixed(2);
    }
    return parseFloat(tour.price).toFixed(2);
  };

  const getCurrencySymbol = () => currency === 'USD' ? '$' : 'QAR';

  const canShowUSD = tour.price_usd && parseFloat(tour.price_usd) > 0;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box
            component="img"
            src={tour.image_url ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${tour.image_url}` : getDefaultImage(tour.title)}
            alt={tour.title}
            sx={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 2, mb: 3 }}
          />

          <Chip label={tour.category} color="primary" sx={{ mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight={700}>
            {tour.title}
          </Typography>

          <Box sx={{ display: 'flex', gap: 3, mb: 3, alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="action" />
              <Typography variant="body1">{tour.duration}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoney color="primary" />
              <Typography variant="h6" color="primary" fontWeight={700}>
                {getPrice()} {getCurrencySymbol()} per person
              </Typography>
            </Box>
            {canShowUSD && (
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => setCurrency(currency === 'QAR' ? 'USD' : 'QAR')}
                sx={{ ml: 'auto' }}
              >
                {currency === 'QAR' ? 'Show USD' : 'Show QAR'}
              </Button>
            )}
          </Box>

          <Typography variant="body1" paragraph>
            {tour.description}
          </Typography>

          <Typography variant="h5" gutterBottom fontWeight={600} sx={{ mt: 4 }}>
            Highlights
          </Typography>
          <Box sx={{ mb: 3 }}>
            {highlights.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <CheckCircle color="primary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>

          <Typography variant="h5" gutterBottom fontWeight={600}>
            What's Included
          </Typography>
          <Box>
            {includes.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                <CheckCircle color="secondary" sx={{ mr: 1, mt: 0.5 }} fontSize="small" />
                <Typography variant="body1">{item}</Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 80 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom fontWeight={700}>
                Book This Tour
              </Typography>

              {tour.getyourguide_url && (
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  href={tour.getyourguide_url}
                  target="_blank"
                  sx={{ mb: 2, bgcolor: '#00d2ff', '&:hover': { bgcolor: '#00b8e6' } }}
                >
                  Book on GetYourGuide
                </Button>
              )}

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                {tour.getyourguide_url ? 'Or fill the form below for direct booking' : 'Fill the form below to book'}
              </Typography>

              {bookingSuccess && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setBookingSuccess(false)}>
                  Booking successful! We'll contact you soon.
                </Alert>
              )}

              {bookingError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setBookingError('')}>
                  {bookingError}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="customer_name"
                  value={bookingData.customer_name}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="customer_email"
                  type="email"
                  value={bookingData.customer_email}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  name="customer_phone"
                  value={bookingData.customer_phone}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Date"
                  name="booking_date"
                  type="date"
                  value={bookingData.booking_date}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Number of People"
                  name="number_of_people"
                  type="number"
                  value={bookingData.number_of_people}
                  onChange={handleInputChange}
                  required
                  inputProps={{ min: 1 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Special Requests"
                  name="special_requests"
                  multiline
                  rows={3}
                  value={bookingData.special_requests}
                  onChange={handleInputChange}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Price
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight={700}>
                    {(getPrice() * bookingData.number_of_people).toFixed(2)} {getCurrencySymbol()}
                  </Typography>
                  {currency === 'USD' && canShowUSD && (
                    <Typography variant="caption" color="text.secondary">
                      ≈ {(tour.price * bookingData.number_of_people).toFixed(2)} QAR
                    </Typography>
                  )}
                </Box>

                <Button type="submit" variant="contained" fullWidth size="large">
                  Confirm Booking
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TourDetail;
