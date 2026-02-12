import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent } from '@mui/material';
import { Star, Security, Support, TrendingUp } from '@mui/icons-material';

const About = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography variant="h3" align="center" gutterBottom fontWeight={700} color="primary">
        About Arabian Adventure
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Your trusted partner for unforgettable experiences in Qatar
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="body1" paragraph>
          Welcome to Arabian Adventure, your premier destination for exploring the wonders of Qatar. We specialize in providing exceptional tour experiences that showcase the rich culture, stunning landscapes, and modern marvels of this beautiful country.
        </Typography>
        <Typography variant="body1" paragraph>
          With years of experience in the tourism industry, our team of professional guides and staff are dedicated to ensuring that every moment of your journey is memorable, safe, and enjoyable.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {[
          { icon: <Star />, title: 'Excellence', desc: 'Committed to providing the highest quality tours and services' },
          { icon: <Security />, title: 'Safety First', desc: 'Your safety and comfort are our top priorities' },
          { icon: <Support />, title: '24/7 Support', desc: 'Round-the-clock customer service for your peace of mind' },
          { icon: <TrendingUp />, title: 'Best Value', desc: 'Competitive pricing with no compromise on quality' },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%', textAlign: 'center' }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 2 }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 48 } })}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
