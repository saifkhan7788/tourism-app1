import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip } from '@mui/material';
import { AccessTime, AttachMoney } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TourCard = ({ tour }) => {
  const navigate = useNavigate();

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

  const imageUrl = tour.image_url 
    ? `${process.env.REACT_APP_API_URL?.replace('/api', '') || 'https://tourism-app1-production.up.railway.app'}${tour.image_url}` 
    : getDefaultImage(tour.title);

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="240"
        image={imageUrl}
        alt={tour.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <Chip label={tour.category} color="primary" size="small" sx={{ mb: 1 }} />
          <Typography variant="h5" component="h2" gutterBottom fontWeight={600}>
            {tour.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {tour.description.substring(0, 120)}...
          </Typography>
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {tour.duration}
              </Typography>
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AttachMoney fontSize="small" color="primary" />
                <Typography variant="h6" color="primary" fontWeight={700}>
                  {tour.price} QAR
                </Typography>
              </Box>
              {tour.price_usd && parseFloat(tour.price_usd) > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'right', display: 'block' }}>
                  ≈ ${parseFloat(tour.price_usd).toFixed(0)} USD
                </Typography>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate(`/tours/${tour.id}`)}
            sx={{ fontWeight: 600 }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TourCard;
