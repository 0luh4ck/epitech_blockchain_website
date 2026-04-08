import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, User, Phone, FileText, Send, CheckCircle2, ArrowLeft, ShieldCheck, Zap } from 'lucide-react';
import { ROUTES } from '../../utils/constants';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { motion } from 'framer-motion';
import ParticleGrid from '../../components/ParticleGrid';
import BlockchainButton from '../../components/BlockchainButton';

const MembershipRequest = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/membership-requests', data);
      setIsSubmitted(true);
      toast.success('Demande d\'adhésion soumise avec succès !');
    } catch (error) {
      console.error('Erreur lors de la soumission de la demande:', error);
      toast.error('Erreur lors de la soumission de la demande. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 relative overflow-hidden">
        <ParticleGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50 relative z-10"
        >
          <div className="mx-auto h-20 w-20 bg-green-50 rounded-full flex items-center justify-center mb-8">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
            Demande Envoyée !
          </h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Votre demande d'adhésion a été transmise au bureau.
            Nous reviendrons vers vous par email très prochainement.
          </p>
          <Link to={ROUTES.HOME} className="block w-full">
            <BlockchainButton className="w-full py-4">
              Retour à l'accueil
            </BlockchainButton>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative bg-white overflow-hidden">
      <ParticleGrid />

      {/* Left Panel: Info & Visual */}
      <div className="w-full md:w-5/12 bg-slate-900 p-12 lg:p-20 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[120px] rounded-full" />
        <div className="relative z-10">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-black tracking-widest mb-20 group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Retour
          </Link>

          <h1 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight tracking-tighter">
            Rejoignez le <br />
            <span className="text-blue-400">Club Blockchain</span>
          </h1>

          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white mb-1">Élite Technologique</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Accédez aux meilleurs workshops et ressources blockchain du pays.</p>
              </div>
            </div>
            <div className="flex gap-6 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white mb-1">Accélération de Carrière</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">Connectez-vous directement avec les entreprises leaders du Web3.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-20">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Engagement 2024-2025</p>
          <div className="h-1 w-24 bg-blue-600 rounded-full" />
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="w-full md:w-7/12 p-12 lg:p-20 flex items-center overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 mb-2">Formulaire d'Adhésion</h2>
            <p className="text-slate-500 font-medium">Parlez-nous un peu de vous pour commencer.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Prénom</label>
                <div className="relative group">
                  <User className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    {...register('firstName', { required: 'Requis' })}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                    placeholder="Vitalik"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Nom</label>
                <input
                  {...register('lastName', { required: 'Requis' })}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                  placeholder="Buterin"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Email Epitech</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('email', { required: 'Requis' })}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                  placeholder="votre.nom@epitech.eu"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Téléphone</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-4 h-4 w-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  {...register('phone')}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900"
                  placeholder="+229 XXXX XXXX"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Votre Motivation</label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-300" />
                <textarea
                  {...register('motivation')}
                  rows={4}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-medium text-slate-900 resize-none"
                  placeholder="Pourquoi rejoindre le club ?"
                />
              </div>
            </div>

            <div className="pt-4">
              <BlockchainButton
                type="submit"
                primary
                disabled={isSubmitting}
                className="w-full py-5 text-lg group"
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </BlockchainButton>
            </div>

            <div className="text-center pt-6">
              <p className="text-sm text-slate-500 font-medium">Déjà membre ? <Link to={ROUTES.LOGIN} className="font-black text-blue-600 hover:underline">Se connecter</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipRequest;
