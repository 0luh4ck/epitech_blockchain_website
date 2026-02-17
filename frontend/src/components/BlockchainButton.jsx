import React, { useState, useRef, useEffect } from 'react';

const BlockchainButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    primary: 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white',
    outline: 'border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white',
    ghost: 'text-green-600 hover:bg-green-50'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const handleClick = (e) => {
    if (disabled) return;

    // Effet de ripple
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now()
    };

    setRipples(prev => [...prev, newRipple]);

    // Animation de clic
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    // Supprimer le ripple après animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-200
        transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
        ${isAnimating ? 'scale-95' : ''}
      `}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Effet de brillance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300 transform -skew-x-12 -translate-x-full hover:translate-x-full" />
      
      {/* Ripples */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute bg-white opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms'
          }}
        />
      ))}
      
      {/* Contenu du bouton */}
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

export default BlockchainButton;
