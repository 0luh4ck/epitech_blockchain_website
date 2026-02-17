import React from 'react';

const MemberPhoto = ({ 
  name, 
  position, 
  imagePath, 
  className = "w-32 h-32",
  showName = true,
  showPosition = true 
}) => {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        {/* Photo ou Placeholder */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg">
          {imagePath ? (
            <img 
              src={imagePath} 
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-full h-full flex items-center justify-center text-white font-bold text-2xl ${
              imagePath ? 'hidden' : 'flex'
            }`}
          >
            {initials}
          </div>
        </div>
        
        {/* Badge de position */}
        {position && (
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              {position}
            </div>
          </div>
        )}
      </div>
      
      {/* Nom et position */}
      {showName && (
        <div className="mt-4 text-center">
          <h3 className="text-sm font-semibold text-gray-900 leading-tight">
            {name}
          </h3>
          {showPosition && position && (
            <p className="text-xs text-gray-600 mt-1">
              {position}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberPhoto;
