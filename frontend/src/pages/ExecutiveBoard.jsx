import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Mail, ExternalLink, ShieldCheck, Zap, Award } from 'lucide-react';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';

const ExecutiveBoard = () => {
  const members = [
    {
      name: 'Moktar S.',
      role: 'Président & Coordinateur Tech',
      description: 'Expert en architectures décentralisées et évangéliste Web3.',
      image: '/logo.png',
      socials: {
        linkedin: '#',
        twitter: '#',
        mail: 'mailto:contact@epitech-blockchain.bj'
      }
    },
    {
      name: 'Jean D.',
      role: 'VP Exécutif',
      description: 'Gestion stratégique et partenariats écosystémiques.',
      image: '/logo.png',
      socials: {
        linkedin: '#',
        twitter: '#'
      }
    },
    {
      name: 'Alice M.',
      role: 'Trésorière',
      description: 'Responsable de la viabilité financière et des subventions.',
      image: '/logo.png',
      socials: {
        linkedin: '#',
        mail: 'mailto:treasury@epitech-blockchain.bj'
      }
    }
  ];

  const boardStructure = [
    {
      title: 'Transparence',
      description: 'Toutes les décisions majeures sont documentées et partagées avec les membres actifs.',
      icon: ShieldCheck
    },
    {
      title: 'Action',
      description: 'Un bureau focalisé sur l\'exécution de projets concrets et de workshops hebdomadaires.',
      icon: Zap
    },
    {
      title: 'Excellence',
      description: 'Une sélection rigoureuse pour garantir un encadrement technique de haut niveau.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden border-b border-slate-100">
        <ParticleGrid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
              Le Bureau <span className="text-gradient-web3">Exécutif</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Rencontrez les leaders qui pilotent la vision du Club Blockchain d'Epitech Bénin.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Board Members Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-blue-500/5 rounded-[40px] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm group-hover:shadow-2xl group-hover:border-blue-200 transition-all duration-300">
                  <div className="aspect-square w-full rounded-3xl overflow-hidden mb-8 border border-slate-50 shadow-inner">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{member.name}</h3>
                  <div className="text-blue-600 font-bold mb-4 tracking-wide uppercase text-xs">{member.role}</div>
                  <p className="text-slate-500 font-medium leading-relaxed mb-10">{member.description}</p>

                  <div className="flex gap-4">
                    {Object.entries(member.socials).map(([platform, link]) => (
                      <a
                        key={platform}
                        href={link}
                        className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        {platform === 'linkedin' && <Linkedin className="w-5 h-5" />}
                        {platform === 'twitter' && <Twitter className="w-5 h-5" />}
                        {platform === 'mail' && <Mail className="w-5 h-5" />}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {boardStructure.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm text-blue-600">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-slate-900 mb-2">{item.title}</h4>
                    <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recruitment Placeholder */}
      <section className="py-32 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-6">Envie de contribuer ?</h2>
          <p className="text-lg text-slate-500 font-medium mb-10">Le bureau s'agrandit régulièrement. Les membres les plus actifs sont prioritaires pour rejoindre l'équipe exécutive.</p>
          <a
            href="mailto:jobs@epitech-blockchain.bj"
            className="inline-flex items-center gap-2 font-black text-blue-600 hover:underline"
          >
            Découvrir les postes ouverts
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ExecutiveBoard;
