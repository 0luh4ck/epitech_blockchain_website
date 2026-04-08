import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Handshake, Globe, Shield, Zap, Award } from 'lucide-react';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';

const Partners = () => {
  const partners = [
    {
      name: 'Epitech Bénin',
      type: 'Partenaire Académique',
      description: 'Notre base de formation et d\'excellence technologique au Bénin.',
      logo: '/logo.png',
      website: 'https://www.epitech.bj'
    },
    {
      name: 'Tech Community',
      type: 'Écosystème',
      description: 'Collaboration étroite sur les événements et le partage de ressources.',
      logo: '/logo.png',
      website: '#'
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Visibilité',
      description: 'Accès direct à une communauté d\'élites technologiques et de développeurs Web3.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Co-développement de solutions blockchain et participation à nos hackathons.'
    },
    {
      icon: Award,
      title: 'Recrutement',
      description: 'Accès privilégié aux meilleurs profils étudiants d\'Epitech Bénin.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-slate-100 bg-slate-50/30">
        <ParticleGrid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
              Nos <span className="text-gradient-web3">Partenaires</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Nous collaborons avec les leaders du secteur pour construire un écosystème blockchain solide au Bénin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BlockchainCard className="p-10">
                  <div className="flex flex-col md:flex-row gap-10 items-center md:items-start text-center md:text-left">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-50 p-4">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
                        {partner.type}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">{partner.name}</h3>
                      <p className="text-slate-500 font-medium leading-relaxed mb-8">{partner.description}</p>
                      <a
                        href={partner.website}
                        className="inline-flex items-center gap-2 font-black text-blue-600 hover:text-blue-700 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visiter le site
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </BlockchainCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Partner with Us */}
      <section className="py-24 bg-slate-900 text-white rounded-[64px] mx-4 md:mx-8 mb-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-8 md:px-16 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Devenir Partenaire</h2>
            <p className="text-blue-400 font-bold uppercase tracking-[0.2em] text-sm">Construisons ensemble</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all text-blue-400">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{benefit.title}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-24 text-center">
            <motion.a
              href="mailto:partners@epitech-blockchain.bj"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-3 px-12 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-2xl shadow-blue-500/30 hover:bg-blue-700 transition-all text-lg"
            >
              <Handshake className="w-6 h-6" />
              Obtenir un dossier de partenariat
            </motion.a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
