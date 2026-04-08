import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import ParticleGrid from '../../components/ParticleGrid';
import BlockchainButton from '../../components/BlockchainButton';

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
    } catch (err) {
      console.error('Login error:', err);
    }
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
      <ParticleGrid />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
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
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/logo.png"
                  alt="Club Blockchain Epitech"
                  className="relative w-20 h-20 rounded-2xl object-cover border border-white/10"
                />
              </div>
            </div>

            <h1 className="text-2xl font-heading font-black text-white mb-2">
              Espace Membre
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Accès réservé aux membres du club
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  {...register('email', {
                    required: 'Requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email invalide',
                    },
                  })}
                  type="email"
                  placeholder="votre.nom@epitech.eu"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400 pl-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  {...register('password', {
                    required: 'Requis',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Votre mot de passe"
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
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
                <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end">
              <a
                href="mailto:contact@epitech-blockchain.bj"
                className="text-xs text-primary-400 hover:underline font-medium"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <BlockchainButton
              type="submit"
              primary
              disabled={isSubmitting}
              className="w-full py-4 mt-2"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Connexion...
                </div>
              ) : (
                'Se connecter'
              )}
            </BlockchainButton>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-gray-600 font-medium">
              © {new Date().getFullYear()} Club Blockchain Epitech — Tous droits réservés
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-gray-600 hover:text-primary-400 transition-colors font-medium"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
