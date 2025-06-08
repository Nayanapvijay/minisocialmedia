import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    { key: 'light', label: 'Light', icon: '☀️' },
    { key: 'dark', label: 'Dark', icon: '🌙' },
    { key: 'grey', label: 'Grey', icon: '🎨' }
  ];

  const currentTheme = themes.find(t => t.key === theme);

  return (
    <div className="theme-toggle">
      <button 
        className="theme-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {currentTheme.icon}
      </button>
      
      {isOpen && (
        <div className="theme-dropdown">
          {themes.map(themeOption => (
            <button
              key={themeOption.key}
              className={`theme-option ${theme === themeOption.key ? 'active' : ''}`}
              onClick={() => {
                toggleTheme(themeOption.key);
                setIsOpen(false);
              }}
            >
              {themeOption.icon} {themeOption.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;