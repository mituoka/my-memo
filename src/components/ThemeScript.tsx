'use client';

import { useEffect } from 'react';

/**
 * Theme script component that runs immediately to prevent FOUC
 * This runs before React hydration to apply the correct theme
 */
export default function ThemeScript() {
  useEffect(() => {
    // This effect only runs on the client side after hydration
    // It ensures the theme is properly applied without causing hydration mismatches
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const savedTheme = localStorage.getItem('theme') || 'light';
          const validThemes = ['light', 'dark', 'custom'];
          const theme = validThemes.includes(savedTheme) ? savedTheme : 'light';
          
          // Remove any existing theme classes
          document.documentElement.classList.remove('light', 'dark', 'custom');
          // Apply theme class immediately to prevent flash
          document.documentElement.classList.add(theme);
          
          // Set color-scheme to override browser preferences
          const colorScheme = theme === 'dark' ? 'dark' : 'light';
          document.documentElement.style.colorScheme = colorScheme;
          
          // Apply custom colors if using custom theme
          if (theme === 'custom') {
            const savedColors = localStorage.getItem('customColors');
            if (savedColors) {
              try {
                const colors = JSON.parse(savedColors);
                document.documentElement.style.setProperty('--custom-primary', colors.primary);
                document.documentElement.style.setProperty('--custom-secondary', colors.secondary);
                document.documentElement.style.setProperty('--custom-accent', colors.accent);
              } catch (e) {
                // Fallback to default custom colors
                document.documentElement.style.setProperty('--custom-primary', '#8b5cf6');
                document.documentElement.style.setProperty('--custom-secondary', '#a78bfa');
                document.documentElement.style.setProperty('--custom-accent', '#10b981');
              }
            }
          }
        } catch (e) {
          // Fallback to light theme on any error
          document.documentElement.classList.add('light');
          document.documentElement.style.colorScheme = 'light';
        }
      })();
    `;
    
    // Insert before other scripts to run as early as possible
    document.head.insertBefore(script, document.head.firstChild);
    
    // Clean up
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null; // This component doesn't render anything
}