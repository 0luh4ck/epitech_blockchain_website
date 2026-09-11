import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import ParticleGrid from '../../components/ParticleGrid';
import BlockchainButton from '../../components/BlockchainButton';

/**
 * Page isolée Superadmin — accessible UNIQUEMENT sur la route confidentielle
 * définie par VITE_SUPERADMIN_ROUTE (jamais liée depuis /login ni la navigation).
 * Envoie space='admin' : le backend n'accepte que role='admin'.
 */
const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated && user) {
      const isAdmin = user.role === 'admin' || user.role === 'superadmin';
      navigate(isAdmin ? ROUTES.ADMIN : ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password, 'admin');
      const role = result?.user?.role;
      const from = location.state?.from?.pathname || ROUTES.ADMIN;
      navigate(role === 'admin' || role === 'superadmin' ? from : ROUTES.DASHBOARD, { replace: true });
    } catch (err) {
      console.error('Admin login error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="animate-spin rounded-full h-14 w-14 border-2 border-transparent border-t-red-500 border-r-amber-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 py-12 px-4">
      <ParticleGrid />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-[40px] p-8 md:p-12 bg-slate-900 border border-red-500/20 shadow-2xl shadow-black">
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-3xl">
                <ShieldAlert className="w-10 h-10 text-red-400" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Accès <span className="text-red-400">Administration</span>
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Zone réservée — Superadmin uniquement
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">
                Email administrateur
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
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
                  placeholder="epiblockchain@epitech.eu"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:bg-slate-800 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-xs font-bold text-red-400 pl-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500 group-focus-within:text-red-400 transition-colors" />
                </div>
                <input
                  {...register('password', { required: 'Requis' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:bg-slate-800 focus:border-red-400 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-red-400 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs font-bold text-red-400 pl-1">{errors.password.message}</p>
              )}
            </div>

            <BlockchainButton
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 mt-2 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
            >
              {isSubmitting ? 'Vérification...' : 'Accéder au panel admin'}
            </BlockchainButton>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            Toute tentative d&apos;accès est journalisée.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link
            to={ROUTES.HOME}
            className="text-sm text-slate-500 hover:text-red-400 transition-colors font-bold uppercase tracking-widest"
          >
            ← Retour
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
