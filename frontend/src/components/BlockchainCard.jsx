import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlockchainCard = ({
  children,
  title,
  description,
  icon: Icon,
  className = '',
  glowColor = '#00d2ff',
  variant = 'default',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Glow background */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}18, transparent 70%)`,
          filter: 'blur(24px)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.1)' : 'scale(1)',
          zIndex: -1,
        }}
      />

      {/* Card body */}
      <div
        className={`relative h-full rounded-2xl p-6 transition-all duration-300 ${isHovered ? 'transform -translate-y-1' : ''
          }`}
        style={{
          background: isHovered
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: isHovered
            ? `1px solid ${glowColor}50`
            : '1px solid rgba(0, 210, 255, 0.1)',
          boxShadow: isHovered
            ? `0 8px 32px rgba(0,0,0,0.2), 0 0 20px ${glowColor}20`
            : '0 4px 16px rgba(0,0,0,0.1)',
        }}
      >
        {/* Icon */}
        {Icon && (
          <motion.div
            className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-xl"
            style={{
              background: `linear-gradient(135deg, ${glowColor}20, ${glowColor}05)`,
              border: `1px solid ${glowColor}30`,
            }}
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              className="w-6 h-6 transition-colors duration-300"
              style={{ color: glowColor }}
            />
          </motion.div>
        )}

        {/* Title */}
        {title && (
          <h3
            className="text-lg font-heading font-bold mb-2 text-gray-900 dark:text-white transition-colors duration-300"
            style={isHovered ? { color: glowColor } : {}}
          >
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
          </p>
        )}

        {/* Custom children */}
        {children}
      </div>
    </motion.div>
  );
};

export default BlockchainCard;
