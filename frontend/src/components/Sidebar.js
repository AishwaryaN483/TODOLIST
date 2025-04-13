import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Sidebar = () => {
  return (
    <Box className="sidebar">
      {/* User Profile */}
      <div className="user-profile">
        <div className="user-avatar">
          <AccountCircleIcon sx={{ fontSize: 40 }} />
        </div>
        <div className="user-info">
          <div className="user-name">Aishwarya</div>
          <div className="user-email">aishwarya@example.com</div>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="nav-items">
        <div className="nav-item">
          <DashboardIcon />
          <Typography>Dashboard</Typography>
        </div>
        <div className="nav-item">
          <SettingsIcon />
          <Typography>Settings</Typography>
        </div>
        <div className="nav-item">
          <HelpIcon />
          <Typography>Help</Typography>
        </div>
      </div>

      {/* Logout Section */}
      <div className="logout-section">
        <div className="nav-item">
          <LogoutIcon />
          <Typography>Logout</Typography>
        </div>
      </div>
    </Box>
  );
};

export default Sidebar;
