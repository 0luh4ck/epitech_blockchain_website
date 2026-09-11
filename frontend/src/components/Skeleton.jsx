import React from 'react';

/**
 * Squelettes de chargement pulsatiles (remplacent les spinners circulaires
 * pour les tableaux, cartes et profils). Thème clair/sombre via `dark`.
 */
const Skeleton = ({
  variant = 'line', // line | avatar | card | table
  lines = 3,
  rows = 5,
  columns = 4,
  dark = false,
  className = '',
}) => {
  const base = dark ? 'skeleton-dark' : 'skeleton';

  if (variant === 'avatar') {
    return <div className={`${base} rounded-full h-10 w-10 shrink-0 ${className}`} aria-hidden="true" />;
  }

  if (variant === 'table') {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label="Chargement en cours">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex gap-3">
            {Array.from({ length: columns }).map((_, c) => (
              <div key={c} className={`${base} h-10 flex-1`} aria-hidden="true" />
            ))}
          </div>
        ))}
        <span className="sr-only">Chargement en cours…</span>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label="Chargement en cours">
        <div className={`${base} h-40 w-full`} aria-hidden="true" />
        <div className={`${base} h-5 w-3/4`} aria-hidden="true" />
        <div className={`${base} h-4 w-full`} aria-hidden="true" />
        <div className={`${base} h-4 w-5/6`} aria-hidden="true" />
        <span className="sr-only">Chargement en cours…</span>
      </div>
    );
  }

  return (
    <div className={`space-y-2.5 ${className}`} role="status" aria-label="Chargement en cours">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${base} h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Chargement en cours…</span>
    </div>
  );
};

export default Skeleton;
