import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const BlockchainCard = ({ 
  children, 
  title,
  description,
  icon: Icon,
  className = '',
  glowColor = '#10B981',
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);
  const cardRef = useRef(null);

  useEffect(() => {
    if (isHovered) {
      // Créer des particules flottantes
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.02 + 0.01
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered]);

  return (
    <motion.div
      ref={cardRef}
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Effet de lueur de fond */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-500 ${
          isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${glowColor}20, transparent 70%)`,
          filter: 'blur(30px)',
          zIndex: -1
        }}
      />
      
      {/* Bordure animée */}
      <div 
        className={`absolute inset-0 rounded-xl transition-all duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
          padding: '2px',
          zIndex: 0
        }}
      >
        <div className="w-full h-full bg-white rounded-xl" />
      </div>
      
      {/* Contenu de la carte */}
      <div className="relative z-10 bg-white rounded-xl p-6 shadow-lg border border-gray-100 h-full">
        {/* Particules flottantes */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: glowColor,
              opacity: particle.opacity
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [particle.opacity, 0, particle.opacity]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: particle.id * 0.2
            }}
          />
        ))}
        
        {/* Icône */}
        {Icon && (
          <motion.div 
            className="mb-4"
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="h-8 w-8 text-green-600" />
          </motion.div>
        )}
        
        {/* Titre */}
        {title && (
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
            {title}
          </h3>
        )}
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">
            {description}
          </p>
        )}
        
        {/* Contenu personnalisé */}
        {children}
      </div>
      
      {/* Effet de brillance au survol */}
      <div 
        className={`absolute inset-0 rounded-xl transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: `linear-gradient(45deg, transparent 30%, ${glowColor}20 50%, transparent 70%)`,
          transform: 'translateX(-100%)',
          animation: isHovered ? 'shimmer 1.5s ease-in-out' : 'none'
        }}
      />
      
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </motion.div>
  );
};

export default BlockchainCard;
