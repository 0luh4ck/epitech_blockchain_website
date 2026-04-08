import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User, Phone, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import ParticleGrid from '../../components/ParticleGrid';
import BlockchainButton from '../../components/BlockchainButton';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm();

  const password = watch('password');

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const onSubmit = async (data) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        studentId: data.studentId
      });
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-lg"
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
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/logo.png"
                  alt="Club Blockchain Epitech"
                  className="relative w-20 h-20 rounded-2xl object-cover border border-white/10"
                />
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 font-heading">
              Rejoindre le <span className="text-gradient-web3">Club</span>
            </h1>
            <p className="text-gray-400 font-medium">
              Créez votre compte pour accéder à l'écosystème.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Prénom</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('firstName', { required: 'Requis' })}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="Prénom"
                  />
                </div>
                {errors.firstName && <p className="mt-1 text-xs text-red-400 pl-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nom</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('lastName', { required: 'Requis' })}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="Nom"
                  />
                </div>
                {errors.lastName && <p className="mt-1 text-xs text-red-400 pl-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Epitech Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                </div>
                <input
                  {...register('email', {
                    required: 'Requis',
                    pattern: { value: /^[^\s@]+@epitech\.eu$/, message: 'L\'email doit être au format @epitech.eu' }
                  })}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                  placeholder="votre.nom@epitech.eu"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-400 pl-1">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Téléphone</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('phone')}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="+229 XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">ID Étudiant</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Zap className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('studentId')}
                    className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="ID"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Mot de passe</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('password', { required: 'Requis', minLength: { value: 6, message: '6 caractères min' } })}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400 pl-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Confirmation</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-600 group-focus-within:text-primary-400 transition-colors" />
                  </div>
                  <input
                    {...register('confirmPassword', {
                      required: 'Requis',
                      validate: value => value === password || 'Non identique'
                    })}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 focus:bg-white/[0.07] transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-600 hover:text-gray-400 transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400 pl-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            <div className="flex items-start gap-3 pl-1">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-primary-500 focus:ring-primary-500/50 transition-all cursor-pointer"
              />
              <label htmlFor="terms" className="text-sm text-gray-500 font-medium">
                J'accepte les <a href="#" className="text-secondary-400 hover:underline">conditions d'utilisation</a>.
              </label>
            </div>

            <BlockchainButton
              type="submit"
              primary
              className="w-full py-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le compte'}
            </BlockchainButton>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-gray-500 font-medium">
              Déjà membre ?{' '}
              <Link to={ROUTES.LOGIN} className="text-primary-400 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to={ROUTES.HOME} className="text-sm text-gray-600 hover:text-primary-400 transition-colors font-medium">
            ← Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
