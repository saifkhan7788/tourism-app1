import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Collapse, keyframes } from '@mui/material';
import { Close, Campaign } from '@mui/icons-material';

const scrollLeft = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/announcements/active');
      const data = await response.json();
      if (data.success && data.data && data.data.length > 0) {
        setAnnouncements(data.data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  if (announcements.length === 0 || !open) return null;

  const combinedMessage = announcements.map(a => a.message).join('   ★   ');
  const firstAnnouncement = announcements[0];

  return (
    <Collapse in={open}>
      <Box
        sx={{
          bgcolor: firstAnnouncement.background_color || '#FFD700',
          color: firstAnnouncement.text_color || '#8B1538',
          py: 1.5,
          px: 2,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Campaign sx={{ mr: 1, fontSize: 20, flexShrink: 0 }} />
          <Box sx={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <Typography
              variant="body1"
              fontWeight={600}
              sx={{
                display: 'inline-block',
                animation: `${scrollLeft} 20s linear infinite`,
                paddingLeft: '100%',
              }}
            >
              {combinedMessage}
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'inherit', ml: 2, flexShrink: 0 }}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Collapse>
  );
};

export default AnnouncementBanner;
