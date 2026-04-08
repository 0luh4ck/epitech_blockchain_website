import React from 'react';
import { Users, Mail, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import MemberPhoto from '../components/MemberPhoto';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const ExecutiveBoard = () => {
  const executiveMembers = [
    {
      name: 'Brouhane BONI GOMINA',
      position: 'Président',
      role: 'admin',
      bio: 'Leader visionnaire et passionné par l\'innovation blockchain. Il guide le club vers de nouveaux horizons.',
      email: 'president@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/brouhane-boni-gomina.jpg'
    },
    {
      name: 'Samuel SOGLOHOUN',
      position: 'Coordinateur du Bureau Exécutif',
      role: 'admin',
      bio: 'Coordinateur expérimenté, il assure la continuité et le développement stratégique du club.',
      email: 'coordinator@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/samuel-soglohoun.jpg'
    },
    {
      name: 'Estelle GOSSOU',
      position: 'Secrétaire Générale',
      role: 'executive',
      bio: 'Organisée et méthodique, elle gère l\'administration et la communication interne du club.',
      email: 'secretary@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/estelle-gossou.jpg'
    },
    {
      name: 'Divine AZANMASSO',
      position: 'Trésorière',
      role: 'executive',
      bio: 'Responsable de la gestion financière et des ressources du club avec rigueur et transparence.',
      email: 'treasurer@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/divine-azanmassou.jpg'
    },
    {
      name: 'Christopher GUIDIBI',
      position: 'Lead du Pôle Evènements et Partenariats',
      role: 'executive',
      bio: 'Créatif et dynamique, il organise nos événements et développe nos partenariats stratégiques.',
      email: 'events@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/christopher-guidibi.jpg'
    },
    {
      name: 'Stella GBAGUIDI',
      position: 'Adjointe du Pôle Evènements et Partenariats',
      role: 'executive',
      bio: 'Support précieux dans l\'organisation d\'événements et la gestion des partenariats.',
      email: 'events-assistant@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/stella-gbaguidi.jpg'
    },
    {
      name: 'Moktar VODOUNNON',
      position: 'Lead du Pôle Tech',
      role: 'executive',
      bio: 'Expert technique, il dirige nos initiatives technologiques et l\'innovation blockchain.',
      email: 'tech-lead@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/moktar-vodounnon.jpg'
    },
    {
      name: 'Imane PHILIPPE',
      position: 'Lead du Pôle Communication',
      role: 'executive',
      bio: 'Responsable de notre image et de notre communication externe avec créativité et professionnalisme.',
      email: 'communication@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/imane-philippe.jpg'
    },
    {
      name: 'Morayo ELEGBEDE',
      position: 'Adjoint Chargé Pôle Communication',
      role: 'executive',
      bio: 'Support essentiel dans la gestion de notre communication et de notre présence digitale.',
      email: 'communication-assistant@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/morayo-elegbede.jpg'
    },
    {
      name: 'Christian ABIALA',
      position: 'Chargé du Pôle Pédago',
      role: 'executive',
      bio: 'Passionné par l\'éducation, il développe nos programmes de formation et d\'apprentissage.',
      email: 'education@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/christian-abiala.jpg'
    },
    {
      name: 'Eunice GOSSOU BAH',
      position: 'Lead Pôle Ressources Humaines',
      role: 'executive',
      bio: 'Gestionnaire des talents, elle s\'occupe du développement et de la satisfaction des membres.',
      email: 'hr@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/eunice-gossou-bah.jpg'
    },
    {
      name: 'Jimmy BACHABI',
      position: 'Adjoint Pôle Ressources Humaines',
      role: 'executive',
      bio: 'Support précieux dans la gestion des ressources humaines et l\'accompagnement des membres.',
      email: 'hr-assistant@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/jimmy-bachabi.jpg'
    },
    {
      name: 'Farid ADOI',
      position: 'Conseiller Pôle Tech et Pédago',
      role: 'executive',
      bio: 'Conseiller expérimenté, il apporte son expertise dans les domaines technique et pédagogique.',
      email: 'advisor@epitech-blockchain.bj',
      linkedin: '#',
      twitter: '#',
      image: '/images/members/farid-adoi.jpg'
    }
  ];

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'border-primary-500/50 text-primary-400 bg-primary-500/10';
      case 'executive':
        return 'border-secondary-500/50 text-secondary-400 bg-secondary-500/10';
      default:
        return 'border-white/20 text-gray-400 bg-white/5';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrateur';
      case 'executive':
        return 'Membre Exécutif';
      default:
        return 'Membre';
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <ParticleGrid />
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Bureau <span className="text-gradient-web3">Exécutif</span> 2025-2026
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
              Rencontrez les membres passionnés qui dirigent notre club avec dévouement et expertise.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Executive Members */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Notre Équipe <span className="text-gradient-web3">Dirigeante</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Des leaders dévoués qui travaillent ensemble pour faire avancer notre mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <BlockchainCard className="h-full group hover:translate-y-[-8px] transition-transform duration-300">
                  <div className="text-center mb-6">
                    <MemberPhoto
                      name={member.name}
                      position={member.position}
                      imagePath={member.image}
                      className="mb-4"
                      showName={false}
                      showPosition={false}
                    />
                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-primary-400 font-semibold mb-3">
                      {member.position}
                    </p>
                    <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full border ${getRoleColor(member.role)}`}>
                      {getRoleLabel(member.role)}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-6 text-center leading-relaxed font-medium">
                    {member.bio}
                  </p>

                  <div className="border-t border-white/5 pt-6 mt-auto">
                    <div className="flex justify-center space-x-6">
                      <a
                        href={`mailto:${member.email}`}
                        className="text-gray-500 hover:text-primary-400 transition-colors"
                        title="Envoyer un email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-primary-500 transition-colors"
                        title="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-secondary-400 transition-colors"
                        title="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </BlockchainCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Structure <span className="text-gradient-web3">Organisationnelle</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Une organisation claire et efficace pour maximiser notre impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BlockchainCard>
              <h3 className="text-xl font-bold text-gradient-web3 mb-6">Direction</h3>
              <ul className="space-y-4 font-medium">
                {['Président', 'Coordinateur du Bureau Exécutif', 'Secrétaire', 'Trésorière'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </BlockchainCard>

            <BlockchainCard>
              <h3 className="text-xl font-bold text-gradient-web3 mb-6">Pôles Opérationnels</h3>
              <ul className="space-y-4 font-medium">
                {['Pôle Évènements et Partenariats', 'Pôle Tech', 'Pôle Communication', 'Pôle Pédago', 'Pôle Ressources Humaines'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary-500 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </BlockchainCard>

            <BlockchainCard>
              <h3 className="text-xl font-bold text-gradient-web3 mb-6">Conseil</h3>
              <ul className="space-y-4 font-medium">
                {['Conseiller Pôle Tech et Pédago', 'Anciens membres du Bureau', 'Partenaires institutionnels'].map((item, i) => (
                  <li key={i} className="flex items-center text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </BlockchainCard>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Contactez <span className="text-gradient-web3">Notre Équipe</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Vous avez des questions ou souhaitez collaborer avec nous ? N'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <BlockchainButton href="mailto:contact@epitech-blockchain.bj" primary size="lg">
              <Mail className="w-5 h-5 mr-2" />
              Nous Contacter
            </BlockchainButton>
            <BlockchainButton href="/membership" size="lg">
              Rejoindre le Club
            </BlockchainButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ExecutiveBoard;
