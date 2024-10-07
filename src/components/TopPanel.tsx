import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useNavigate } from 'react-router-dom';

const TopPanel: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          My App
        </Typography>
        <Button 
          color="inherit" 
          startIcon={<HomeIcon />} 
          onClick={handleHomeClick}
        >
          Home
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopPanel;