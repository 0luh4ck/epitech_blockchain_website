import React, { useState, useEffect } from 'react';

const GlitchText = ({ 
  text, 
  className = '', 
  glitchIntensity = 'medium',
  colors = ['#10B981', '#3B82F6', '#8B5CF6'],
  ...props 
}) => {
  const [displayText, setDisplayText] = useState(text);
  const [isGlitching, setIsGlitching] = useState(false);

  const intensities = {
    low: { duration: 100, frequency: 0.1 },
    medium: { duration: 200, frequency: 0.2 },
    high: { duration: 300, frequency: 0.3 }
  };

  const intensity = intensities[glitchIntensity];

  const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?~`';

  const glitch = () => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    const originalText = text;
    let glitchedText = '';
    
    for (let i = 0; i < originalText.length; i++) {
      if (Math.random() < intensity.frequency) {
        glitchedText += glitchChars[Math.floor(Math.random() * glitchChars.length)];
      } else {
        glitchedText += originalText[i];
      }
    }
    
    setDisplayText(glitchedText);
    
    setTimeout(() => {
      setDisplayText(originalText);
      setIsGlitching(false);
    }, intensity.duration);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% de chance de glitch
        glitch();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={glitch}
      {...props}
    >
      {/* Texte principal */}
      <span className="relative z-10">
        {displayText}
      </span>
      
      {/* Effets de glitch */}
      {isGlitching && (
        <>
          <span 
            className="absolute inset-0 text-red-500 opacity-70"
            style={{ 
              transform: 'translate(-2px, 0)',
              filter: 'blur(1px)'
            }}
          >
            {displayText}
          </span>
          <span 
            className="absolute inset-0 text-blue-500 opacity-70"
            style={{ 
              transform: 'translate(2px, 0)',
              filter: 'blur(1px)'
            }}
          >
            {displayText}
          </span>
        </>
      )}
      
      {/* Effet de brillance */}
      <span 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-30 transition-opacity duration-300 transform -skew-x-12 -translate-x-full hover:translate-x-full"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${colors[0]}, transparent)`
        }}
      />
    </span>
  );
};

export default GlitchText;
