import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import BlockchainButton from './BlockchainButton';
import GlitchText from './GlitchText';

const BlockchainError = ({ 
  code = '404', 
  title = 'Page non trouvée', 
  message = 'La page que vous recherchez n\'existe pas ou a été déplacée.',
  showHomeButton = true,
  showRefreshButton = false 
}) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
      {/* Effets de particules */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-1/3 right-1/2 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-1/5 left-1/2 w-1 h-1 bg-purple-300 rounded-full animate-bounce opacity-60"></div>
      </div>

      <div className="relative text-center max-w-2xl mx-auto">
        {/* Code d'erreur avec effet glitch */}
        <div className="mb-8">
          <GlitchText 
            text={code} 
            className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400"
            glitchIntensity="high"
          />
        </div>

        {/* Icône d'erreur */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full border-2 border-red-500/30">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        {/* Titre */}
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          <GlitchText text={title} glitchIntensity="medium" />
        </h1>

        {/* Message */}
        <p className="text-lg text-gray-300 mb-8 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {showHomeButton && (
            <BlockchainButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = ROUTES.HOME}
              className="group"
            >
              <span className="flex items-center">
                <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Retour à l'accueil
              </span>
            </BlockchainButton>
          )}

          {showRefreshButton && (
            <BlockchainButton
              variant="outline"
              size="lg"
              onClick={handleRefresh}
              glowColor="#3B82F6"
              className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
            >
              <span className="flex items-center">
                <RefreshCw className="mr-2 w-5 h-5" />
                Actualiser
              </span>
            </BlockchainButton>
          )}
        </div>

        {/* Lien de contact */}
        <div className="mt-8">
          <p className="text-gray-400 text-sm">
            Si le problème persiste,{' '}
            <Link 
              to={ROUTES.CONTACT} 
              className="text-green-400 hover:text-green-300 transition-colors underline"
            >
              contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainError;
