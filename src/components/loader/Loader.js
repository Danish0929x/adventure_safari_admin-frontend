import React, { useState, useEffect } from 'react';
import './Loader.css';

function Loader() {
  return (
    <div className="loader-container">
      <div className="bouncing-squares">
        <div className="square square-1"></div>
        <div className="square square-2"></div>
        <div className="square square-3"></div>
      </div>
    </div>
  );
}

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);
    
    // Wait for everything to load
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return isLoading;
}

export default Loader;