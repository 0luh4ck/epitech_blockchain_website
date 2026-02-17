import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isExecutive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Accueil', href: ROUTES.HOME },
    { name: 'À Propos', href: ROUTES.ABOUT },
    { name: 'Bureau Exécutif', href: ROUTES.EXECUTIVE_BOARD },
    { name: 'Partenaires', href: ROUTES.PARTNERS },
    { name: 'Activités', href: ROUTES.ACTIVITIES },
    { name: 'Contact', href: ROUTES.CONTACT }
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (route) => {
    return location.pathname === route;
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to={ROUTES.HOME} className="flex items-center">
              <img 
                src="/images/logo/Epitech Blockchain Club Logo.jpg" 
                alt="Logo Club Blockchain Epitech" 
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="ml-3 text-xl font-bold text-gray-900">
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
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActiveRoute(item.href)
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.firstName}
                  </span>
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {user?.position && (
                        <p className="text-xs text-green-600 font-medium">
                          {user.position}
                        </p>
                      )}
                    </div>
                    
                    <Link
                      to={ROUTES.DASHBOARD}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Link>
                    
                    <Link
                      to={ROUTES.PROFILE}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Mon profil
                    </Link>
                    
                    {(isAdmin() || isExecutive()) && (
                      <Link
                        to={ROUTES.ADMIN}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Administration
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={ROUTES.LOGIN}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 px-6 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Espace Membre
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-green-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActiveRoute(item.href)
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {!isAuthenticated && (
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="block px-4 py-3 rounded-lg text-base font-medium text-center bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Espace Membre
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
