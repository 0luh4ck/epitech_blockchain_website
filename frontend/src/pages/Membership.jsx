import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send,
  CheckCircle2,
  Info,
  User,
  Mail,
  MessageSquare,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainButton from '../components/BlockchainButton';
import { useAuth } from '../context/AuthContext';

const Membership = () => {
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    }
  });

  const onSubmit = async (data) => {
    // Simulating API call
    console.log('Membership request:', data);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
  };

  const benefits = [
    {
      icon: Zap,
      title: 'Accès Prioritaire',
      description: 'Soyez informé en premier des nouveaux workshops et hackathons.'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Validez vos compétences avec des certificats reconnus par l\'écosystème.'
    },
    {
      icon: ShieldCheck,
      title: 'Gouvernance',
      description: 'Participez aux décisions d\'orientation technique du club.'
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <ParticleGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Demande Envoyée !</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Votre demande d'adhésion est en cours de révision par le bureau. Vous recevrez une notification par email sous 48h.
          </p>
          <BlockchainButton onClick={() => window.location.href = '/'} className="w-full">
            Retour à l'accueil
          </BlockchainButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      <ParticleGrid />

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left: Info Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600">Rejoindre l'élite</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              Devenez <br />
              <span className="text-gradient-web3">Membre Actif</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium mb-12 leading-relaxed">
              L'adhésion au Club Blockchain d'Epitech Bénin vous ouvre les portes d'un réseau technologique exclusif et de ressources premium.
            </p>

            <div className="space-y-8">
              {benefits.map((benefit, i) => {
                const Icon = benefit.icon;
                return (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:border-blue-200 transition-all">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 mb-1">{benefit.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white rounded-[48px] p-8 md:p-12 border border-slate-100 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[100px] -z-1" />

              <div className="mb-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <Send className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Formulaire d'Adhésion</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Session 2024-2025</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Prénom</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        {...register('firstName', { required: true })}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Nom</label>
                    <input
                      {...register('lastName', { required: true })}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Email Epitech</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      {...register('email', { required: true })}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Motivation (Facultatif)</label>
                  <div className="relative group">
                    <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                    <textarea
                      {...register('message')}
                      rows="4"
                      placeholder="Pourquoi souhaitez-vous rejoindre le club ?"
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-medium text-slate-900 resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 items-start">
                  <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700 font-medium leading-relaxed">
                    L'adhésion est gratuite mais nécessite une implication active dans les projets du club.
                  </p>
                </div>

                <BlockchainButton
                  type="submit"
                  primary
                  disabled={isSubmitting}
                  className="w-full py-5 text-lg shadow-xl shadow-blue-500/20"
                >
                  {isSubmitting ? 'Envoi...' : 'Soumettre ma demande'}
                </BlockchainButton>
              </form>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Membership;
