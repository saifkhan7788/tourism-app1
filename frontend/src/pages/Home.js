import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Button, CircularProgress, Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import TourCard from '../components/TourCard';
import AnnouncementBanner from '../components/AnnouncementBanner';
import { tourAPI } from '../services/api';

const Home = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const NextArrow = (props) => {
    const { onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          right: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          cursor: 'pointer',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <Typography sx={{ color: '#8B1538', fontSize: 30, fontWeight: 'bold' }}>›</Typography>
      </Box>
    );
  };

  const PrevArrow = (props) => {
    const { onClick } = props;
    return (
      <Box
        onClick={onClick}
        sx={{
          position: 'absolute',
          left: 20,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 2,
          cursor: 'pointer',
          bgcolor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
            transform: 'translateY(-50%) scale(1.1)',
          },
        }}
      >
        <Typography sx={{ color: '#8B1538', fontSize: 30, fontWeight: 'bold' }}>‹</Typography>
      </Box>
    );
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    fade: true,
    pauseOnHover: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  const heroImages = [
    { url: 'https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?w=1200', title: 'Desert Safari Adventures' },
    { url: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200', title: 'Explore Doha City' },
    { url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200', title: 'Cultural Experiences' },
    { url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200', title: 'Water Sports & Cruises' },
  ];

  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://tourism-app1-production.up.railway.app/api'}/gallery`);
      const data = await response.json();
      if (data.success && data.data.length > 0) {
        setGalleryImages(data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery:', error);
    }
  };

  const displayImages = galleryImages.length > 0 ? galleryImages : heroImages;

  return (
    <>
      {/* Hero Section with Carousel */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <Slider {...carouselSettings}>
          {displayImages.map((image, index) => (
            <Box key={index}>
              <Box
                sx={{
                  height: { xs: '350px', sm: '400px', md: '450px' },
                  backgroundImage: `linear-gradient(rgba(139, 21, 56, 0.6), rgba(93, 14, 37, 0.6)), url(${image.image_url ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001'}${image.image_url}` : image.url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Container maxWidth="md" sx={{ textAlign: 'center', color: 'white', zIndex: 1, px: 3 }}>
                  <Typography variant="h2" component="h1" gutterBottom fontWeight={700} sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    Discover Qatar's Hidden Treasures
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, opacity: 0.95, textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                    {image.title || image.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate('/tours')}
                    sx={{ px: 4, py: 1.5, fontSize: '1.1rem', boxShadow: 3 }}
                  >
                    Explore Tours
                  </Button>
                </Container>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Announcement Ticker */}
      <AnnouncementBanner />

      {/* Tours Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight={700} color="primary">
            Our Premium Tours
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Choose from our carefully curated selection of experiences
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

      {/* Why Choose Us Section */}
      <Box sx={{ bgcolor: 'background.default', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom fontWeight={700} color="primary">
            Why Choose Arabian Adventure?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              { title: 'Expert Guides', desc: 'Professional and knowledgeable tour guides' },
              { title: 'Best Prices', desc: 'Competitive rates with no hidden fees' },
              { title: 'Safety First', desc: 'Your safety is our top priority' },
              { title: '24/7 Support', desc: 'Round-the-clock customer assistance' },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;
