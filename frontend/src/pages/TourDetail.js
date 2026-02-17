import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Grid, Card, CardContent, Button, TextField, Chip, CircularProgress, Alert, Dialog, IconButton } from '@mui/material';
import { AccessTime, AttachMoney, CheckCircle, Close, ChevronLeft, ChevronRight } from '@mui/icons-material';
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
    booking_time: '',
    adults: 1,
    children: 0,
    special_requests: '',
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [openGallery, setOpenGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });
    
    // Show time slots when date is selected
    if (name === 'booking_date' && value) {
      setShowTimeSlots(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    const infantMax = tour.infant_age_max || 2;
    const childMin = tour.child_age_min || 3;
    
    if (bookingData.children > 0 && bookingData.children < childMin) {
      setBookingError(`Children must be aged ${childMin}-${tour.child_age_max || 11}. Ages ${infantMax} and younger are not permitted.`);
      return;
    }
    
    try {
      const totalPeople = bookingData.adults + bookingData.children;
      const totalPriceQAR = tour.price * totalPeople;
      const totalPriceUSD = tour.price_usd ? (tour.price_usd * totalPeople) : null;
      
      await bookingAPI.create({
        ...bookingData,
        tour_id: tour.id,
        number_of_people: totalPeople,
        total_price: totalPriceQAR,
        total_price_usd: totalPriceUSD,
      });
      setBookingSuccess(true);
      setBookingData({
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        booking_date: '',
        booking_time: '',
        adults: 1,
        children: 0,
        special_requests: '',
      });
      setShowTimeSlots(false);
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

  const getOriginalPrice = () => {
    if (currency === 'USD' && tour.original_price_usd) {
      return parseFloat(tour.original_price_usd).toFixed(2);
    }
    return parseFloat(tour.original_price).toFixed(2);
  };

  const getCurrencySymbol = () => currency === 'USD' ? '$' : 'QAR';

  const canShowUSD = tour.price_usd && parseFloat(tour.price_usd) > 0;

  const hasDiscount = (currency === 'USD' ? tour.original_price_usd : tour.original_price) && tour.discount_percentage > 0;

  const startingTimes = tour.starting_times ? (typeof tour.starting_times === 'string' ? JSON.parse(tour.starting_times) : tour.starting_times) : [];

  const galleryImages = tour.gallery_images ? (typeof tour.gallery_images === 'string' ? JSON.parse(tour.gallery_images) : tour.gallery_images) : [];
  const allImages = [tour.image_url, ...galleryImages].filter(Boolean);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Chip label={tour.category} sx={{ mb: 2, bgcolor: '#8B1538', color: 'white', fontWeight: 600 }} />
          <Typography variant="h3" fontWeight={700} sx={{ mb: 2, color: '#1a1a1a' }}>
            {tour.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, px: 2, py: 1, bgcolor: 'white', borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <AccessTime sx={{ fontSize: 20, color: '#8B1538' }} />
              <Typography variant="body2" fontWeight={600}>{tour.duration}</Typography>
            </Box>
            {canShowUSD && (
              <Button 
                size="small" 
                variant="outlined" 
                onClick={() => setCurrency(currency === 'QAR' ? 'USD' : 'QAR')}
                sx={{ borderColor: '#8B1538', color: '#8B1538', '&:hover': { borderColor: '#6B0F28', bgcolor: '#fff5f5' } }}
              >
                {currency === 'QAR' ? 'Show USD' : 'Show QAR'}
              </Button>
            )}
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Left Column - Tour Details */}
          <Grid item xs={12} md={8}>
            {/* Hero Image */}
            <Box
              component="img"
              src={tour.image_url ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${tour.image_url}` : getDefaultImage(tour.title)}
              alt={tour.title}
              onClick={() => { setCurrentImageIndex(0); setOpenGallery(true); }}
              sx={{ width: '100%', height: 450, objectFit: 'cover', borderRadius: 3, mb: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer' }}
            />

            {/* Gallery Thumbnails */}
            {galleryImages.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, mb: 3, overflowX: 'auto', pb: 1 }}>
                {galleryImages.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${img}`}
                    alt={`${tour.title} ${idx + 1}`}
                    onClick={() => { setCurrentImageIndex(idx + 1); setOpenGallery(true); }}
                    sx={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', flexShrink: 0, '&:hover': { opacity: 0.8 } }}
                  />
                ))}
              </Box>
            )}

            {/* Price Section */}
            <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>From</Typography>
                  {hasDiscount ? (
                    <Box>
                      <Typography variant="h6" sx={{ textDecoration: 'line-through', color: 'text.secondary', display: 'inline', mr: 2 }}>
                        {getCurrencySymbol()} {getOriginalPrice()}
                      </Typography>
                      <Chip label={`Save ${tour.discount_percentage}%`} size="small" sx={{ bgcolor: '#d32f2f', color: 'white', fontWeight: 700 }} />
                      <Typography variant="h3" fontWeight={700} sx={{ color: '#8B1538', mt: 1 }}>
                        {getCurrencySymbol()} {getPrice()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="h3" fontWeight={700} sx={{ color: '#8B1538' }}>
                      {getCurrencySymbol()} {getPrice()}
                    </Typography>
                  )}
                  <Typography variant="body2" color="text.secondary">per person</Typography>
                </Box>
              </Box>
            </Card>

            {/* Description */}
            <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2, color: '#1a1a1a' }}>About this experience</Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: '#4a4a4a' }}>{tour.description}</Typography>
            </Card>

            {/* Features Box */}
            <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', bgcolor: '#f0f7ff' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, color: '#1a1a1a' }}>Key Features</Typography>
              <Grid container spacing={2}>
                {tour.free_cancellation && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#2e7d32', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Free cancellation</Typography>
                        <Typography variant="body2" color="text.secondary">Up to {tour.cancellation_hours || 24} hours in advance</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.reserve_now_pay_later && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#2e7d32', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Reserve now, pay later</Typography>
                        <Typography variant="body2" color="text.secondary">Book your spot today</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.pickup_included && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#8B1538', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Pickup included</Typography>
                        <Typography variant="body2" color="text.secondary">{tour.pickup_details || 'From any Doha location'}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.languages && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#8B1538', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Live tour guide</Typography>
                        <Typography variant="body2" color="text.secondary">{typeof tour.languages === 'string' ? JSON.parse(tour.languages).join(', ') : (tour.languages || []).join(', ')}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.private_group_available && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#8B1538', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Private groups available</Typography>
                        <Typography variant="body2" color="text.secondary">Exclusive experience option</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
                {tour.transport_rating && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5 }}>
                      <CheckCircle sx={{ color: '#2e7d32', fontSize: 24, mt: 0.2 }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700}>Highly-rated transport</Typography>
                        <Typography variant="body2" color="text.secondary">{tour.transport_rating}% perfect score</Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Card>

            {/* Highlights */}
            <Card sx={{ mb: 3, p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#1a1a1a' }}>Highlights</Typography>
              <Grid container spacing={1.5}>
                {highlights.map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1.5, p: 1.5, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                      <CheckCircle sx={{ color: '#8B1538', fontSize: 20, mt: 0.3 }} />
                      <Typography variant="body1" sx={{ color: '#4a4a4a' }}>{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* What's Included */}
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#1a1a1a' }}>What's included</Typography>
              <Grid container spacing={1.5}>
                {includes.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'start', gap: 1 }}>
                      <CheckCircle sx={{ color: '#FFD700', fontSize: 20, mt: 0.3 }} />
                      <Typography variant="body2" sx={{ color: '#4a4a4a' }}>{item}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>

          {/* Right Column - Booking Card */}
          <Grid item xs={12} md={4}>
            <Card sx={{ position: 'sticky', top: 100, borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: '#1a1a1a' }}>
                  Book This Tour
                </Typography>

                {bookingSuccess && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setBookingSuccess(false)}>
                    Booking successful! We'll contact you soon.
                  </Alert>
                )}

                {bookingError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setBookingError('')}>
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
                    size="small"
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
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="customer_phone"
                    value={bookingData.customer_phone}
                    onChange={handleInputChange}
                    required
                    sx={{ mb: 2 }}
                    size="small"
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
                    inputProps={{ min: new Date().toISOString().split('T')[0] }}
                    sx={{ mb: 2 }}
                    size="small"
                  />
                  
                  {/* Time Slots */}
                  {showTimeSlots && startingTimes.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Select Time</Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {startingTimes.map((time, index) => (
                          <Button
                            key={index}
                            variant={bookingData.booking_time === time ? 'contained' : 'outlined'}
                            size="small"
                            onClick={() => setBookingData({ ...bookingData, booking_time: time })}
                            sx={{
                              borderColor: '#8B1538',
                              color: bookingData.booking_time === time ? 'white' : '#8B1538',
                              bgcolor: bookingData.booking_time === time ? '#8B1538' : 'transparent',
                              '&:hover': {
                                bgcolor: bookingData.booking_time === time ? '#6B0F28' : '#fff5f5',
                                borderColor: '#6B0F28'
                              }
                            }}
                          >
                            {time}
                          </Button>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Participants Section */}
                  <Box sx={{ mb: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2 }}>Participants</Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Adult</Typography>
                        <Typography variant="caption" color="text.secondary">(Age {tour.adult_age_min || 12}-{tour.adult_age_max || 99})</Typography>
                      </Box>
                      <TextField
                        name="adults"
                        type="number"
                        value={bookingData.adults}
                        onChange={handleInputChange}
                        required
                        inputProps={{ min: 1, max: 50 }}
                        sx={{ width: 80 }}
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>Child</Typography>
                        <Typography variant="caption" color="text.secondary">(Age {tour.child_age_min || 3}-{tour.child_age_max || 11})</Typography>
                      </Box>
                      <TextField
                        name="children"
                        type="number"
                        value={bookingData.children}
                        onChange={handleInputChange}
                        inputProps={{ min: 0, max: 50 }}
                        sx={{ width: 80 }}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.5, fontStyle: 'italic' }}>
                      Ages {tour.infant_age_max || 2} and younger are not permitted.
                    </Typography>
                  </Box>
                  <TextField
                    fullWidth
                    label="Special Requests"
                    name="special_requests"
                    multiline
                    rows={3}
                    value={bookingData.special_requests}
                    onChange={handleInputChange}
                    sx={{ mb: 3 }}
                    size="small"
                  />

                  <Box sx={{ bgcolor: '#f8f9fa', p: 2.5, borderRadius: 2, mb: 3, border: '2px solid #e0e0e0' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      Total Price ({bookingData.adults + bookingData.children} {bookingData.adults + bookingData.children === 1 ? 'person' : 'people'})
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#8B1538' }}>
                      {getCurrencySymbol()} {(getPrice() * (bookingData.adults + bookingData.children)).toFixed(2)}
                    </Typography>
                    {currency === 'USD' && canShowUSD && (
                      <Typography variant="caption" color="text.secondary">
                        ≈ {(tour.price * (bookingData.adults + bookingData.children)).toFixed(2)} QAR
                      </Typography>
                    )}
                  </Box>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth 
                    size="large"
                    sx={{ 
                      bgcolor: '#8B1538', 
                      py: 1.5, 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#6B0F28' },
                      boxShadow: '0 4px 12px rgba(139,21,56,0.3)'
                    }}
                  >
                    Confirm Booking
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Gallery Modal */}
      <Dialog open={openGallery} onClose={() => setOpenGallery(false)} maxWidth="lg" fullWidth>
        <Box sx={{ position: 'relative', bgcolor: 'black', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton onClick={() => setOpenGallery(false)} sx={{ position: 'absolute', top: 10, right: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
            <Close />
          </IconButton>
          {allImages.length > 1 && (
            <>
              <IconButton onClick={handlePrevImage} sx={{ position: 'absolute', left: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
                <ChevronLeft fontSize="large" />
              </IconButton>
              <IconButton onClick={handleNextImage} sx={{ position: 'absolute', right: 10, color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
                <ChevronRight fontSize="large" />
              </IconButton>
            </>
          )}
          <Box
            component="img"
            src={allImages[currentImageIndex] ? (allImages[currentImageIndex].startsWith('http') ? allImages[currentImageIndex] : `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${allImages[currentImageIndex]}`) : getDefaultImage(tour.title)}
            alt={tour.title}
            sx={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
          <Typography sx={{ position: 'absolute', bottom: 20, color: 'white', bgcolor: 'rgba(0,0,0,0.6)', px: 2, py: 1, borderRadius: 2 }}>
            {currentImageIndex + 1} / {allImages.length}
          </Typography>
        </Box>
      </Dialog>
    </Box>
  );
};

export default TourDetail;
