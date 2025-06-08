import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import SocialFeed from './components/SocialFeed';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="App">
        <SocialFeed />
      </div>
    </ThemeProvider>
  );
}

export default App;