import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
          <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-blue-600 border-r-green-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50/50 py-12 px-4">
      <ParticleGrid />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div
          className="rounded-[40px] p-8 md:p-12 bg-white border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative group p-1 bg-gradient-to-tr from-blue-600 to-green-500 rounded-3xl shrink-0">
                <img
                  src="/logo.png"
                  alt="Club Blockchain Epitech"
                  className="relative w-20 h-20 rounded-[22px] object-cover border-2 border-white"
                />
              </div>
            </div>

            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">
              Espace <span className="text-blue-600">Membre</span>
            </h1>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              Connexion sécurisée
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">
                Adresse Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email requis',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Format invalide',
                    },
                  })}
                  type="email"
                  placeholder="votre.nom@epitech.eu"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  {...register('password', {
                    required: 'Requis',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-300 hover:text-blue-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex justify-end pt-1">
              <a
                href="mailto:contact@epitech-blockchain.bj"
                className="text-xs text-blue-600 hover:text-blue-700 font-black tracking-tight"
              >
                Accès perdu ?
              </a>
            </div>

            <BlockchainButton
              type="submit"
              primary
              disabled={isSubmitting}
              className="w-full py-4.5 mt-2 shadow-lg shadow-blue-500/20"
            >
              {isSubmitting ? 'Connexion...' : 'Se connecter'}
            </BlockchainButton>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <p className="text-sm text-slate-500 font-medium">Pas encore membre ?</p>
            <Link to={ROUTES.REGISTER} className="text-sm font-black text-blue-600 hover:underline mt-2 inline-block">Créer un compte</Link>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-slate-400 hover:text-blue-600 transition-colors font-bold uppercase tracking-widest"
          >
            ← Retour
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
