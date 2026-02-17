import React from 'react';

const BlockchainLoader = ({ size = 'md', text = 'Chargement...' }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animation de blockchain */}
      <div className="relative">
        {/* Cercle principal */}
        <div className={`${sizes[size]} border-4 border-gray-200 rounded-full animate-spin`}>
          <div className="absolute inset-0 border-4 border-transparent border-t-green-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-0 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>
      
      {/* Texte de chargement */}
      <div className="text-center">
        <p className="text-gray-600 font-medium">{text}</p>
        <div className="flex space-x-1 mt-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainLoader;
