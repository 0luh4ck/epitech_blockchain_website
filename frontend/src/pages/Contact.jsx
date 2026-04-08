import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const Contact = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log('Message envoyé:', data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@epitech-blockchain.bj',
      link: 'mailto:contact@epitech-blockchain.bj',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      icon: Phone,
      title: 'Téléphone',
      value: '+229 01 40 60 52 21',
      link: 'tel:+2290140605221',
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      icon: MapPin,
      title: 'Adresse',
      value: 'Epitech Bénin, Cotonou',
      link: '#',
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <ParticleGrid />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl shadow-slate-200/50"
        >
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Message Envoyé !</h2>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            Merci pour votre intérêt. Notre équipe vous répondra dans un délai de 24 à 48 heures.
          </p>
          <BlockchainButton onClick={() => setIsSubmitted(false)} className="w-full">
            Envoyer un autre message
          </BlockchainButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 pt-20">
      <ParticleGrid />

      {/* Hero Header */}
      <section className="py-24 border-b border-slate-100 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter text-slate-900">
              Parlons <span className="text-gradient-web3">Futur</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
              Une question, un projet ou une envie de collaborer ? Nous sommes à votre écoute.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

            {/* Contact Info Chips */}
            <div className="lg:col-span-4 space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 pl-1">Canaux Directs</h3>
              {contactInfo.map((info, i) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={i}
                    href={info.link}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-6 p-6 bg-white border border-slate-100 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
                  >
                    <div className={`w-14 h-14 ${info.bg} rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{info.title}</div>
                      <div className="text-sm font-bold text-slate-900 truncate">{info.value}</div>
                    </div>
                  </motion.a>
                );
              })}

              <div className="mt-16 p-8 bg-slate-900 rounded-[40px] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-bl-full" />
                <h4 className="text-lg font-black mb-4">Horaires</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-medium border-b border-white/5 pb-2">
                    <span className="text-slate-400">Lun - Ven</span>
                    <span>08:00 - 18:00</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium border-b border-white/5 pb-2">
                    <span className="text-slate-400">Samedi</span>
                    <span>09:00 - 15:00</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-blue-400">
                    <span>Dimanche</span>
                    <span className="font-black uppercase tracking-widest">Fermé</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-8">
              <BlockchainCard className="p-10 md:p-16">
                <div className="mb-12">
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Envoyez-nous un message</h2>
                  <p className="text-slate-500 font-medium">Nous reviendrons vers vous très rapidement.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Prénom</label>
                      <input
                        {...register('firstName', { required: true })}
                        placeholder="Satoshi"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900 placeholder-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Nom</label>
                      <input
                        {...register('lastName', { required: true })}
                        placeholder="Nakamoto"
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900 placeholder-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Adresse Email</label>
                    <input
                      {...register('email', { required: true })}
                      placeholder="satoshi@bitcoin.org"
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-400 transition-all font-bold text-slate-900 placeholder-slate-300"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">Votre Message</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-5 top-5 w-4 h-4 text-slate-300" />
                      <textarea
                        {...register('message', { required: true, minLength: 10 })}
                        rows={6}
                        placeholder="Dites-nous tout..."
                        className="w-full pl-14 pr-5 py-5 bg-slate-50 border border-slate-100 rounded-[32px] outline-none focus:bg-white focus:border-blue-400 transition-all font-medium text-slate-900 resize-none placeholder-slate-300"
                      />
                    </div>
                    {errors.message && (
                      <p className="text-red-500 text-[10px] font-black uppercase mt-2 pl-1">Le message doit contenir au moins 10 caractères</p>
                    )}
                  </div>

                  <div className="pt-4">
                    <BlockchainButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 text-lg group"
                    >
                      {isSubmitting ? 'Envoi...' : 'Envoyer le Message'}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </BlockchainButton>
                  </div>
                </form>
              </BlockchainCard>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
