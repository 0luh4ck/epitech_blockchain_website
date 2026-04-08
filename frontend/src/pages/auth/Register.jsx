import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  UserCircle,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';
import ParticleGrid from '../../components/ParticleGrid';
import BlockchainButton from '../../components/BlockchainButton';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger
  } = useForm({
    defaultValues: {
      role: 'member'
    }
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      navigate(ROUTES.LOGIN);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const nextStep = async () => {
    const fields = step === 1 ? ['firstName', 'lastName'] : ['email', 'password'];
    const isValid = await trigger(fields);
    if (isValid) setStep(step + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50/50 py-20 px-4">
      <ParticleGrid />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl"
      >
        <div className="bg-white rounded-[48px] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row">

          {/* Left Panel: Info (Visual for Light Mode) */}
          <div className="w-full md:w-5/12 bg-slate-900 p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent opacity-50" />
            <div className="relative z-10">
              <Link to={ROUTES.HOME} className="inline-block mb-12">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-xl border border-white/20" />
              </Link>
              <h2 className="text-3xl font-black text-white mb-6 leading-tight">Rejoignez la <br />Révolution.</h2>
              <div className="space-y-6">
                <div className="flex gap-4 items-center text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium">Accès @epitech.eu sécurisé</p>
                </div>
                <div className="flex gap-4 items-center text-slate-400">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-sm font-medium">Workshops Web3 hebdomadaires</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-12">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Étape {step} sur 3</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-blue-500' : 'w-4 bg-white/10'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Form */}
          <div className="w-full md:w-7/12 p-8 md:p-12">
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Qui êtes-vous ?</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Prénom</label>
                        <div className="relative group">
                          <User className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            {...register('firstName', { required: 'Le prénom est requis' })}
                            placeholder="Vitalik"
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                          />
                        </div>
                        {errors.firstName && <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.firstName.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Nom</label>
                        <div className="relative group">
                          <UserCircle className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            {...register('lastName', { required: 'Le nom est requis' })}
                            placeholder="Buterin"
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                          />
                        </div>
                        {errors.lastName && <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.lastName.message}</p>}
                      </div>
                    </div>
                    <BlockchainButton onClick={nextStep} className="w-full py-4 mt-6">
                      Continuer
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </BlockchainButton>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <h3 className="text-2xl font-black text-slate-900 mb-8">Identifiants Epitech</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Email Epitech</label>
                        <div className="relative group">
                          <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            {...register('email', {
                              required: 'Email requis',
                              pattern: { value: /^[A-Z0-9._%+-]+@epitech\.eu$/i, message: 'Email @epitech.eu uniquement' }
                            })}
                            placeholder="votre.nom@epitech.eu"
                            className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                          />
                        </div>
                        {errors.email && <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Mot de passe</label>
                        <div className="relative group">
                          <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                          <input
                            {...register('password', {
                              required: 'Requis',
                              minLength: { value: 6, message: '6 caractères minimum' }
                            })}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-4 text-slate-300 hover:text-blue-500"
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.password && <p className="mt-2 text-xs font-bold text-red-500 pl-1">{errors.password.message}</p>}
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <BlockchainButton variant="secondary" onClick={() => setStep(1)} className="w-1/3">Retour</BlockchainButton>
                      <BlockchainButton onClick={nextStep} className="w-2/3">Dernière étape</BlockchainButton>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 text-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 className="w-10 h-10 text-blue-600" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4">Prêt à embarquer ?</h3>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                      En créant votre compte, vous acceptez de rejoindre la communauté active du Club Blockchain Epitech Bénin.
                    </p>

                    <BlockchainButton
                      type="submit"
                      primary
                      disabled={isSubmitting}
                      className="w-full py-5 text-lg"
                    >
                      {isSubmitting ? 'Création...' : 'Créer mon compte'}
                    </BlockchainButton>
                    <button type="button" onClick={() => setStep(2)} className="mt-4 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors">Modifier mes infos</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            {step !== 3 && (
              <div className="text-center mt-10 pt-6 border-t border-slate-50">
                <p className="text-sm text-slate-500 font-medium">Déjà inscrit ? <Link to={ROUTES.LOGIN} className="font-black text-blue-600 hover:underline">Se connecter</Link></p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
