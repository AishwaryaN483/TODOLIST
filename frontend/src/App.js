import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <Sidebar />
        <MainContent />
      </Box>
    </ThemeProvider>
  );
}

export default App;
