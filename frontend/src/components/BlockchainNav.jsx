import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ROUTES } from '../utils/constants';

const BlockchainNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isExecutive } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const navigation = [
    { name: 'Accueil', href: ROUTES.HOME },
    { name: 'À Propos', href: ROUTES.ABOUT },
    { name: 'Bureau', href: ROUTES.EXECUTIVE_BOARD },
    { name: 'Partenaires', href: ROUTES.PARTNERS },
    { name: 'Activités', href: ROUTES.ACTIVITIES },
    { name: 'Adhésion', href: ROUTES.MEMBERSHIP },
    { name: 'Contact', href: ROUTES.CONTACT },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white/10 dark:bg-black/30 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-9 h-9">
                <img
                  src="../public/logo.png"
                  alt="Club Blockchain Epitech"
                  className="w-9 h-9 rounded-lg object-cover ring-1 ring-primary-500/40 group-hover:ring-primary-500 transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Fallback logo */}
                <div
                  className="hidden w-9 h-9 rounded-lg items-center justify-center text-white font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                >
                  BC
                </div>
              </div>
              <span className="font-heading font-bold text-lg text-gray-900 dark:text-white group-hover:text-gradient-web3 transition-colors duration-300 hidden sm:block">
                Club Blockchain
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${isActiveRoute(item.href)
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/5'
                    }`}
                >
                  {item.name}
                  {isActiveRoute(item.href) && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #00d2ff, #7000ff)' }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2">

              {/* Dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 hover:bg-primary-500/10 transition-all duration-200"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Auth section */}
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-primary-500/30 hover:border-primary-500/60 hover:bg-primary-500/5 transition-all duration-200"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                    >
                      {user?.firstName?.[0] || 'U'}
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.firstName || 'Profil'}
                    </span>
                  </button>

                  {/* User dropdown */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 rounded-2xl overflow-hidden shadow-xl shadow-black/20 border border-white/10 dark:border-white/5 bg-white/90 dark:bg-dark-card/95 backdrop-blur-xl z-50">
                      <div className="p-1">
                        <Link
                          to={ROUTES.DASHBOARD}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-xl transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Tableau de bord
                        </Link>
                        <Link
                          to={ROUTES.PROFILE}
                          className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 rounded-xl transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Mon profil
                        </Link>
                        {(isAdmin() || isExecutive()) && (
                          <Link
                            to={ROUTES.ADMIN}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-secondary-500/10 hover:text-secondary-400 rounded-xl transition-all"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4" />
                            Administration
                          </Link>
                        )}
                        <div className="my-1 border-t border-gray-200/50 dark:border-white/5" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          Déconnexion
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to={ROUTES.MEMBERSHIP_REQUEST}
                    className="px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all duration-300 hover:shadow-glow-cyan hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                  >
                    Rejoindre
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-primary-500/10 hover:text-primary-500 transition-all"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
          <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-xl border-t border-white/10 px-4 py-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActiveRoute(item.href)
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-primary-500/5 hover:text-primary-500'
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-gray-200/50 dark:border-white/5 flex flex-col gap-2">
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-3 text-sm font-medium text-center text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 rounded-xl hover:border-primary-500/50 transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Connexion
                </Link>
                <Link
                  to={ROUTES.MEMBERSHIP_REQUEST}
                  className="px-4 py-3 text-sm font-semibold text-center text-white rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rejoindre le Club
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16" />
    </>
  );
};

export default BlockchainNav;
