import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const BlockchainToast = ({ 
  type = 'success', 
  message, 
  onClose, 
  duration = 4000,
  position = 'top-right' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const types = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500',
      borderColor: 'border-green-400',
      textColor: 'text-green-100',
      glowColor: '#10B981'
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-500',
      borderColor: 'border-red-400',
      textColor: 'text-red-100',
      glowColor: '#EF4444'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-400',
      textColor: 'text-yellow-100',
      glowColor: '#F59E0B'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-100',
      glowColor: '#3B82F6'
    }
  };

  const config = types[type];
  const Icon = config.icon;

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-fermeture
    const closeTimer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  };

  return (
    <div 
      className={`fixed ${positions[position]} z-50 transition-all duration-300 ${
        isVisible && !isLeaving 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-2 scale-95'
      }`}
    >
      <div 
        className={`
          relative max-w-sm w-full ${config.bgColor} ${config.borderColor} 
          border-2 rounded-lg shadow-lg overflow-hidden
        `}
        style={{
          boxShadow: `0 0 20px ${config.glowColor}40`
        }}
      >
        {/* Effet de brillance */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"
          style={{
            background: `linear-gradient(90deg, transparent, ${config.glowColor}40, transparent)`
          }}
        />
        
        <div className="relative p-4 flex items-start space-x-3">
          {/* Icône avec animation */}
          <div className="flex-shrink-0">
            <div className="relative">
              <Icon className={`w-6 h-6 ${config.textColor} animate-pulse`} />
              <div 
                className="absolute inset-0 rounded-full animate-ping opacity-30"
                style={{ backgroundColor: config.glowColor }}
              />
            </div>
          </div>
          
          {/* Message */}
          <div className="flex-1">
            <p className={`text-sm font-medium ${config.textColor}`}>
              {message}
            </p>
          </div>
          
          {/* Bouton de fermeture */}
          <button
            onClick={handleClose}
            className={`flex-shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        {/* Barre de progression */}
        <div className="absolute bottom-0 left-0 h-1 bg-black/20 w-full">
          <div 
            className="h-full bg-white/30 animate-pulse"
            style={{
              animation: `progress ${duration}ms linear forwards`,
              backgroundColor: config.glowColor
            }}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default BlockchainToast;
