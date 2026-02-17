import React, { useState, useRef } from 'react';

const Card3D = ({ 
  children, 
  className = '', 
  intensity = 20, 
  perspective = 1000,
  glowColor = '#10B981',
  ...props 
}) => {
  const [transform, setTransform] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / centerY * intensity;
    const rotateY = (centerX - x) / centerX * intensity;
    
    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg)`);
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-300 ${className}`}
      style={{ 
        transform,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      {...props}
    >
      {/* Effet de lueur */}
      <div 
        className={`absolute inset-0 rounded-lg transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${glowColor}20, transparent 70%)`,
          filter: 'blur(20px)',
          zIndex: -1
        }}
      />
      
      {/* Contenu de la carte */}
      <div 
        className="relative z-10 h-full"
        style={{ transform: 'translateZ(20px)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Card3D;
