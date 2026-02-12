import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText, Container, Menu, MenuItem } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon, AccountCircle, Dashboard, ExitToApp, Palette } from '@mui/icons-material';
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
    <Box sx={{ width: 250 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.label} component={Link} to={item.path} onClick={handleDrawerToggle}>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        {isAuthenticated && (
          <ListItem button component={Link} to="/admin" onClick={handleDrawerToggle}>
            <ListItemText primary="Admin" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" elevation={2}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
              Arabian Adventure
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
              {menuItems.map((item) => (
                <Button 
                  key={item.label} 
                  component={Link} 
                  to={item.path} 
                  color="inherit" 
                  sx={{ 
                    fontWeight: 500,
                    borderBottom: location.pathname === item.path ? '2px solid #FFD700' : '2px solid transparent',
                    borderRadius: 0,
                    pb: 0.5
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
                    color="inherit" 
                    startIcon={<Dashboard />} 
                    sx={{ 
                      fontWeight: 500,
                      borderBottom: location.pathname === '/admin' ? '2px solid #FFD700' : '2px solid transparent',
                      borderRadius: 0,
                      pb: 0.5
                    }}
                  >
                    Admin
                  </Button>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2, px: 2, py: 0.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <AccountCircle />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                        {user?.username || 'User'}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, lineHeight: 1 }}>
                        {user?.role || 'Admin'}
                      </Typography>
                    </Box>
                  </Box>
                  <Button onClick={handleLogout} color="inherit" startIcon={<ExitToApp />} sx={{ ml: 1, border: '1px solid rgba(255,255,255,0.3)', fontWeight: 500 }}>
                    Logout
                  </Button>
                  <IconButton color="inherit" onClick={(e) => setThemeMenu(e.currentTarget)} size="small" sx={{ ml: 1 }}>
                    <Palette />
                  </IconButton>
                </>
              ) : (
                <IconButton color="inherit" onClick={(e) => setThemeMenu(e.currentTarget)} size="small" sx={{ ml: 1 }}>
                  <Palette />
                </IconButton>
              )}
            </Box>

            <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display: { md: 'none' } }}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawer}
      </Drawer>

      <Menu anchorEl={themeMenu} open={Boolean(themeMenu)} onClose={() => setThemeMenu(null)}>
        {Object.entries(themes).map(([key, value]) => (
          <MenuItem key={key} onClick={() => { changeTheme(key); setThemeMenu(null); }} selected={currentTheme === key}>
            {value.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default Navbar;
