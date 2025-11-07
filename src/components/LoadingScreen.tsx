"use client";

import { useEffect, useState } from "react";

type LoadingScreenProps = {
  duration?: number; // Duración en milisegundos
  onComplete?: () => void;
};

export default function LoadingScreen({ 
  duration = 1000, 
  onComplete 
}: LoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Iniciar fade out un poco antes de completar
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, duration - 300);

    // Ocultar completamente después de la duración
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onComplete?.();
    }, duration);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`loading-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="loading-content">
        {/* Logo animado */}
        <div className="loading-logo-container">
          <img 
            src="/logo.png" 
            alt="Loading" 
            className="loading-logo"
          />
        </div>

        {/* Spinner */}
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>

        {/* Texto opcional */}
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}