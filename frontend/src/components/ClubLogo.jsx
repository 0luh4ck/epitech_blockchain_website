import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

/**
 * Logo officiel du club. Importé depuis assets pour une résolution fiable sous Vite
 * quelle que soit la profondeur de la route.
 */
const ClubLogo = ({
  className = 'h-10 w-auto object-contain',
  alt = 'Epitech Blockchain Club Logo',
  showFallbackBadge = false,
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (showFallbackBadge) {
      return (
        <div
          className={`flex items-center justify-center font-bold text-white rounded-lg px-2 py-1 text-xs bg-gradient-to-r from-blue-600 to-green-500 ${className}`}
        >
          BC
        </div>
      );
    }
    // Fallback d'urgence à /logo.png public si l'asset bundled échouait
    return (
      <img
        src="/logo.png"
        alt={alt}
        className={className}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  return (
    <img
      src={logoImg}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ClubLogo;
