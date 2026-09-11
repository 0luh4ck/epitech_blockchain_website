import React, { useState } from 'react';

/**
 * Logo officiel du club. Chemin absolu imposé (/logo.png) + fallback propre :
 * si le fichier est absent, l'image est retirée sans boucle de rechargement
 * ni interface cassée.
 */
const ClubLogo = ({
  className = 'h-10 w-auto object-contain',
  alt = 'Epitech Blockchain Club Logo',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  return (
    <img
      src="/logo.png"
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ClubLogo;
