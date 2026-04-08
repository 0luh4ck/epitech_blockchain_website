import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckCircle, Users, Calendar, Award, Globe, Heart, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { membershipService } from '../services/membership';
import toast from 'react-hot-toast';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const Membership = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const benefits = [
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez une communauté de plus de 30 étudiants passionnés par la blockchain'
    },
    {
      icon: Calendar,
      title: 'Événements Exclusifs',
      description: 'Accès prioritaire à nos séminaires, conférences et ateliers'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues et validez vos compétences'
    },
    {
      icon: Globe,
      title: 'Réseau Professionnel',
      description: 'Connectez-vous avec des professionnels et des experts du secteur'
    }
  ];

  const onSubmit = async (data) => {
    try {
      await membershipService.submitApplication(data);
      setIsSubmitted(true);
      toast.success('Demande d\'adhésion soumise avec succès !');
    } catch (err) {
      console.error('Erreur adhésion:', err);
      toast.error('Erreur lors de la soumission de votre demande');
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center py-24 px-4">
        <ParticleGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full"
        >
          <BlockchainCard className="text-center p-12">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-500/20">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-white mb-6">
              Demande <span className="text-gradient-web3">Transmise</span>
            </h1>
            <p className="text-lg text-gray-400 mb-10 leading-relaxed font-medium">
              Merci pour votre intérêt ! Votre demande d'adhésion a été transmise à notre équipe pour examen.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-left space-y-4">
              <h3 className="text-sm font-bold text-primary-400 uppercase tracking-wider mb-2">Prochaines étapes</h3>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-400 text-xs font-bold">1</div>
                <p className="text-gray-400 text-sm font-medium">Examen de votre dossier sous 48h</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-400 text-xs font-bold">2</div>
                <p className="text-gray-400 text-sm font-medium">Réception d'un email de confirmation</p>
              </div>
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 text-primary-400 text-xs font-bold">3</div>
                <p className="text-gray-400 text-sm font-medium">Activation de vos accès membre</p>
              </div>
            </div>
            <BlockchainButton onClick={() => setIsSubmitted(false)} primary size="lg" className="w-full">
              Retour au formulaire
            </BlockchainButton>
          </BlockchainCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden border-b border-white/5">
        <ParticleGrid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Rejoindre le <span className="text-gradient-web3">Club Blockchain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
              Devenez acteur de la révolution Web3 au Bénin en rejoignant notre communauté d'élite.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Info */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-10 inline-block border-b-2 border-primary-500 pb-2">Pourquoi nous ?</h2>
                <div className="grid grid-cols-1 gap-8">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-6 group"
                      >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary-500/50 group-hover:bg-primary-500/10 transition-all duration-300">
                          <Icon className="w-7 h-7 text-primary-400 transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-2">{benefit.title}</h3>
                          <p className="text-gray-400 font-medium leading-relaxed">{benefit.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-16">
                <BlockchainCard className="bg-primary-500/5 border-primary-500/20">
                  <h3 className="text-lg font-bold text-primary-400 mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Critères d'Adhésion
                  </h3>
                  <ul className="space-y-3 text-gray-300 font-medium">
                    <li className="flex gap-3">
                      <Zap className="w-4 h-4 text-secondary-500 shrink-0 mt-1" />
                      <span>Étudiant Epitech Bénin ou partenaire tech</span>
                    </li>
                    <li className="flex gap-3">
                      <Zap className="w-4 h-4 text-secondary-500 shrink-0 mt-1" />
                      <span>Curiosité pour la décentralisation</span>
                    </li>
                    <li className="flex gap-3">
                      <Zap className="w-4 h-4 text-secondary-500 shrink-0 mt-1" />
                      <span>Volonté de contribuer activement</span>
                    </li>
                  </ul>
                </BlockchainCard>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="lg:col-span-7">
              <BlockchainCard className="p-8 md:p-10">
                <h2 className="text-2xl font-bold text-white mb-8 pr-1">Prendre son adhésion</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Prénom</label>
                      <input
                        {...register('firstName', { required: 'Ce champ est requis' })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                        placeholder="Votre prénom"
                      />
                      {errors.firstName && <p className="text-red-400 text-xs mt-1 pl-1">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Nom</label>
                      <input
                        {...register('lastName', { required: 'Ce champ est requis' })}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                        placeholder="Votre nom"
                      />
                      {errors.lastName && <p className="text-red-400 text-xs mt-1 pl-1">{errors.lastName.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Email</label>
                    <input
                      {...register('email', {
                        required: 'L\'email est requis',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email invalide' }
                      })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1 pl-1">{errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Téléphone</label>
                      <input
                        {...register('phone')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                        placeholder="+229 XX XX XX XX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Promotion / ID</label>
                      <input
                        {...register('studentId')}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                        placeholder="Promotion"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Motivation</label>
                    <textarea
                      {...register('motivation', {
                        required: 'La motivation est requise',
                        minLength: { value: 50, message: 'Expliquez un peu plus (50 car. min)' }
                      })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all resize-none"
                      placeholder="Pourquoi souhaitez-vous nous rejoindre ?"
                    />
                    {errors.motivation && <p className="text-red-400 text-xs mt-1 pl-1">{errors.motivation.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2 pl-1">Centres d'intérêt (optionnel)</label>
                    <input
                      {...register('interests')}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-primary-500/50 outline-none transition-all"
                      placeholder="DeFi, NFT, Smart Contracts, etc."
                    />
                  </div>

                  <BlockchainButton
                    type="submit"
                    primary
                    disabled={isSubmitting}
                    className="w-full py-4 mt-4"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    {isSubmitting ? 'Soumission...' : 'Soumettre ma Demande'}
                  </BlockchainButton>
                </form>
              </BlockchainCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;
