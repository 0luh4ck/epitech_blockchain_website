import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    } catch (_) { }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-primary-500 border-r-secondary-500" />
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 border-2 border-primary-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#050505] py-12 px-4">
      {/* Background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{ background: 'radial-gradient(circle, #00d2ff, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #7000ff, transparent)' }} />
      </div>

      {/* Animated grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,210,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div
          className="rounded-3xl p-8 md:p-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(0,210,255,0.15)',
            boxShadow: '0 0 60px rgba(0,210,255,0.08), 0 40px 80px rgba(0,0,0,0.4)',
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            {/* Logo */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <img
                  src="/images/logo/Epitech Blockchain Club Logo.jpg"
                  alt="Club Blockchain Epitech"
                  className="w-16 h-16 rounded-xl object-cover"
                  style={{ border: '2px solid rgba(0,210,255,0.4)', boxShadow: '0 0 20px rgba(0,210,255,0.3)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden w-16 h-16 rounded-xl items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                >
                  <Zap className="w-8 h-8" />
                </div>
              </div>
            </div>

            <h1 className="text-2xl font-heading font-black text-white mb-2">
              Espace Membre
            </h1>
            <p className="text-sm text-gray-500">
              Accès réservé aux membres du bureau exécutif
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-600" />
                </div>
                <input
                  {...register('email', {
                    required: 'Votre adresse email est requise',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Format d\'email invalide',
                    },
                  })}
                  type="email"
                  placeholder="votre.nom@epitech.eu"
                  className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.email ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(0,210,255,0.15)',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(0,210,255,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,210,255,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.border = errors.email ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(0,210,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-600" />
                </div>
                <input
                  {...register('password', {
                    required: 'Le mot de passe est requis',
                    minLength: { value: 6, message: 'Au moins 6 caractères' },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  className="w-full pl-11 pr-12 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: errors.password ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(0,210,255,0.15)',
                  }}
                  onFocus={e => {
                    e.target.style.border = '1px solid rgba(0,210,255,0.5)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0,210,255,0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.border = errors.password ? '1px solid rgba(248,113,113,0.5)' : '1px solid rgba(0,210,255,0.15)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <a
                href="mailto:contact@blockchain-epitech.com"
                className="text-xs text-primary-500 hover:text-primary-400 transition-colors"
              >
                Contacter l'administrateur
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-sm font-semibold font-heading text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
              }}
              onMouseEnter={e => {
                if (!isSubmitting) {
                  e.currentTarget.style.boxShadow = '0 0 25px rgba(0,210,255,0.5), 0 0 50px rgba(112,0,255,0.25)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} Club Blockchain Epitech — Tous droits réservés
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-600 hover:text-primary-400 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
