import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import BlockchainButton from './BlockchainButton';

const BlockchainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isExecutive } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Accueil', href: ROUTES.HOME },
    { name: 'À Propos', href: ROUTES.ABOUT },
    { name: 'Bureau Exécutif', href: ROUTES.EXECUTIVE_BOARD },
    { name: 'Partenaires', href: ROUTES.PARTNERS },
    { name: 'Activités', href: ROUTES.ACTIVITIES },
    { name: 'Adhésion', href: ROUTES.MEMBERSHIP },
    { name: 'Contact', href: ROUTES.CONTACT }
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo avec effet blockchain */}
          <div className="flex-shrink-0">
            <Link to={ROUTES.HOME} className="flex items-center group">
              <div className="relative">
                <img 
                  src="/images/logo/Epitech Blockchain Club Logo.jpg" 
                  alt="Logo Club Blockchain Epitech" 
                  className="w-10 h-10 rounded-lg object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                Club Blockchain
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActiveRoute(item.href)
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.name}
                {isActiveRoute(item.href) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 opacity-0 hover:opacity-100 transition-opacity rounded-md"></div>
              </Link>
            ))}
          </nav>

          {/* Actions utilisateur */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.[0] || 'U'}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName || 'Utilisateur'}
                  </span>
                </button>

                {/* Menu utilisateur */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Link>
                    
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon profil
                    </Link>
                    
                    {(isAdmin() || isExecutive()) && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Connexion
                </Link>
                <BlockchainButton
                  variant="primary"
                  size="sm"
                  onClick={() => window.location.href = ROUTES.MEMBERSHIP_REQUEST}
                >
                  Demande d'adhésion
                </BlockchainButton>
              </div>
            )}

            {/* Menu mobile button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default BlockchainNav;
