import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Container, Menu, MenuItem, Avatar, Chip } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, AccountCircle, Dashboard, ExitToApp, Palette, FlightTakeoff } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeContext, themes } from '../context/ThemeContext';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [themeMenu, setThemeMenu] = useState(null);
  const { isAuthenticated, logout, user } = useAuth();
  const { currentTheme, changeTheme } = useThemeContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Tours', path: '/tours' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', background: 'linear-gradient(135deg, #8B1538 0%, #5a0e24 100%)' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoff /> Menu
        </Typography>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List sx={{ px: 2, py: 3 }}>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.label} 
            component={Link} 
            to={item.path} 
            onClick={handleDrawerToggle}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,215,0,0.15)' },
              bgcolor: location.pathname === item.path ? 'rgba(255,215,0,0.2)' : 'transparent'
            }}
          >
            <ListItemText primary={item.label} sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem 
            button 
            component={Link} 
            to="/admin" 
            onClick={handleDrawerToggle}
            sx={{
              mb: 1,
              borderRadius: 2,
              color: 'white',
              '&:hover': { bgcolor: 'rgba(255,215,0,0.15)' },
              bgcolor: location.pathname === '/admin' ? 'rgba(255,215,0,0.2)' : 'transparent'
            }}
          >
            <ListItemText primary="Admin Dashboard" sx={{ '& .MuiTypography-root': { fontWeight: 500 } }} />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #8B1538 0%, #a01845 100%)',
          borderBottom: '3px solid #FFD700',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: { xs: 64, md: 80 } }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1.5 
              }}
            >
              <Avatar 
                sx={{ 
                  bgcolor: '#FFD700', 
                  color: '#8B1538', 
                  width: 48, 
                  height: 48,
                  boxShadow: '0 4px 12px rgba(255,215,0,0.3)'
                }}
              >
                <FlightTakeoff sx={{ fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'white', 
                    fontWeight: 800, 
                    letterSpacing: 0.5,
                    lineHeight: 1.2,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  Arabian Adventure
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: '#FFD700', 
                    fontWeight: 600,
                    letterSpacing: 1
                  }}
                >
                  Explore Qatar
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.label} 
                  component={Link} 
                  to={item.path} 
                  sx={{ 
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgba(255,215,0,0.15)',
                      transform: 'translateY(-2px)'
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: location.pathname === item.path ? '80%' : '0%',
                      height: '3px',
                      bgcolor: '#FFD700',
                      borderRadius: '2px 2px 0 0',
                      transition: 'width 0.3s ease'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              {isAuthenticated ? (
                <>
                  <Button 
                    component={Link} 
                    to="/admin" 
                    startIcon={<Dashboard />}
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      px: 2.5,
                      py: 1,
                      ml: 1,
                      borderRadius: 2,
                      bgcolor: location.pathname === '/admin' ? 'rgba(255,215,0,0.2)' : 'transparent',
                      border: '1px solid rgba(255,215,0,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,215,0,0.25)',
                        borderColor: '#FFD700'
                      }
                    }}
                  >
                    Dashboard
                  </Button>
                  <Chip
                    avatar={<Avatar sx={{ bgcolor: '#FFD700', color: '#8B1538' }}>{user?.username?.charAt(0).toUpperCase()}</Avatar>}
                    label={user?.username || 'User'}
                    sx={{
                      ml: 2,
                      bgcolor: 'rgba(255,255,255,0.15)',
                      color: 'white',
                      fontWeight: 600,
                      px: 1,
                      '& .MuiChip-label': { px: 1.5 },
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,215,0,0.2)'
                    }}
                  />
                  <Button 
                    onClick={handleLogout} 
                    startIcon={<ExitToApp />}
                    sx={{ 
                      ml: 1,
                      color: 'white',
                      fontWeight: 600,
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderColor: 'white'
                      }
                    }}
                  >
                    Logout
                  </Button>
                  <IconButton 
                    onClick={(e) => setThemeMenu(e.currentTarget)}
                    sx={{ 
                      ml: 1,
                      color: '#FFD700',
                      bgcolor: 'rgba(255,215,0,0.1)',
                      '&:hover': { bgcolor: 'rgba(255,215,0,0.2)' }
                    }}
                  >
                    <Palette />
                  </IconButton>
                </>
              ) : (
                <IconButton 
                  onClick={(e) => setThemeMenu(e.currentTarget)}
                  sx={{ 
                    ml: 2,
                    color: '#FFD700',
                    bgcolor: 'rgba(255,215,0,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,215,0,0.2)' }
                  }}
                >
                  <Palette />
                </IconButton>
              )}
            </Box>

            <IconButton 
              color="inherit" 
              edge="end" 
              onClick={handleDrawerToggle} 
              sx={{ 
                display: { md: 'none' },
                bgcolor: 'rgba(255,215,0,0.15)',
                '&:hover': { bgcolor: 'rgba(255,215,0,0.25)' }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Menu 
        anchorEl={themeMenu} 
        open={Boolean(themeMenu)} 
        onClose={() => setThemeMenu(null)}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }
        }}
      >
        {Object.entries(themes).map(([key, value]) => (
          <MenuItem 
            key={key} 
            onClick={() => { changeTheme(key); setThemeMenu(null); }} 
            selected={currentTheme === key}
            sx={{
              fontWeight: currentTheme === key ? 600 : 400,
              color: currentTheme === key ? '#8B1538' : 'inherit'
            }}
          >
            {value.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Navbar;
