import React from 'react';
import BlockchainError from '../components/BlockchainError';

const NotFound = () => {
  return (
    <BlockchainError
      code="404"
      title="Page non trouvée"
      message="La page que vous recherchez n'existe pas ou a été déplacée. Vérifiez l'URL ou retournez à la page d'accueil."
      showHomeButton={true}
      showRefreshButton={false}
    />
  );
};

export default NotFound;
