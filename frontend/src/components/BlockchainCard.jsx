import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BlockchainCard = ({
  children,
  title,
  description,
  icon: Icon,
  className = '',
  glowColor = '#3b82f6', // New default Blue
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
      {/* Subtle Glow background (adapted for light mode) */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}10, transparent 70%)`,
          filter: 'blur(20px)',
          opacity: isHovered ? 1 : 0,
          transform: isHovered ? 'scale(1.05)' : 'scale(1)',
          zIndex: -1,
        }}
      />

      {/* Card body */}
      <div
        className={`relative h-full rounded-2xl p-6 transition-all duration-300 bg-white border border-slate-100 shadow-sm ${isHovered ? 'transform -translate-y-1 border-blue-200 shadow-xl shadow-blue-500/5' : ''
          }`}
      >
        {/* Icon */}
        {Icon && (
          <motion.div
            className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${glowColor}10, ${glowColor}05)`,
              border: `1px solid ${glowColor}15`,
            }}
            animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Icon
              className="w-7 h-7 transition-colors duration-300"
              style={{ color: glowColor }}
            />
          </motion.div>
        )}

        {/* Title */}
        {title && (
          <h3
            className="text-xl font-heading font-black mb-3 text-slate-900 transition-colors duration-300"
            style={isHovered ? { color: glowColor } : {}}
          >
            {title}
          </h3>
        )}

        {/* Description */}
        {description && (
          <p className="text-sm font-medium text-slate-500 leading-relaxed mb-4">
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
