import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isAdmin, isExecutive } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: 'Accueil', href: ROUTES.HOME },
    { name: 'À Propos', href: ROUTES.ABOUT },
    { name: 'Bureau', href: ROUTES.EXECUTIVE_BOARD },
    { name: 'Partenaires', href: ROUTES.PARTNERS },
    { name: 'Activités', href: ROUTES.ACTIVITIES }
  ];

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setIsUserMenuOpen(false);
  };

  const isActiveRoute = (route) => location.pathname === route;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg border-b border-slate-100 py-3 shadow-sm' : 'bg-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center group">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-green-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
              <img
                src="/logo.png"
                alt="Logo"
                className="relative w-10 h-10 rounded-xl object-cover border border-white/50 bg-white"
              />
            </div>
            <div className="ml-4 flex flex-col">
              <span className="text-sm font-black text-slate-900 tracking-tighter uppercase leading-none">Club Blockchain</span>
              <span className="text-[10px] font-bold text-blue-600 tracking-[0.2em] uppercase mt-0.5">Epitech Bénin</span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${isActiveRoute(item.href)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {item.name}
                {isActiveRoute(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-1.5 pr-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group"
                >
                  <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-green-500 rounded-xl flex items-center justify-center p-0.5 shadow-md group-hover:scale-105 transition-transform">
                    <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <span className="hidden sm:block text-xs font-black text-slate-700 uppercase tracking-tighter">
                    {user?.firstName}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 p-2"
                    >
                      <div className="px-4 py-4 mb-2 bg-slate-50/50 rounded-2xl border border-slate-50">
                        <p className="text-sm font-black text-slate-900 truncate">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5">{user?.email}</p>
                      </div>

                      <div className="space-y-1">
                        <Link
                          to={ROUTES.PROFILE}
                          className="flex items-center px-4 py-3 text-xs font-black text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Mon Profil
                        </Link>

                        {(isAdmin() || isExecutive()) && (
                          <Link
                            to={ROUTES.ADMIN}
                            className="flex items-center px-4 py-3 text-xs font-black text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Shield className="w-4 h-4 mr-3" />
                            Administration
                          </Link>
                        )}

                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <LogOut className="w-4 h-4 mr-3" />
                          Déconnexion
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to={ROUTES.LOGIN}
                  className="hidden sm:block text-xs font-black text-slate-600 hover:text-blue-600 px-4 transition-colors uppercase tracking-widest"
                >
                  Connexion
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95"
                >
                  Rejoindre
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-4 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${isActiveRoute(item.href)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link
                  to={ROUTES.LOGIN}
                  className="block px-4 py-4 rounded-2xl text-sm font-black text-center bg-slate-900 text-white mt-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Espace Membre
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
