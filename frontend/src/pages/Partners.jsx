import React from 'react';
import { ExternalLink, Globe, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';
import BlockchainButton from '../components/BlockchainButton';

const Partners = () => {
  const partners = [
    {
      name: 'Epitech Afrique',
      description: 'École d\'informatique et d\'innovation technologique de référence en Afrique. Epitech forme les futurs experts en technologies de l\'information avec une approche pratique et innovante.',
      website: 'https://www.epitech.africa/',
      email: 'contact@epitech.africa',
      phone: '+229 XX XX XX XX',
      logo: '/images/partners/epitech.png',
      type: 'Institution Académique'
    },
    {
      name: 'Future Studio',
      description: 'Studio d\'innovation et de développement technologique qui accompagne les entreprises dans leur transformation digitale. Future Studio est un partenaire clé pour nos projets d\'innovation.',
      website: 'https://www.futurestudio.bj/',
      email: 'info@futurestudio.bj',
      phone: '+229 XX XX XX XX',
      logo: '/images/partners/future-studio.png',
      type: 'Studio d\'Innovation'
    },
    {
      name: 'Africa Blockchain Institute',
      description: 'Institut de formation et de recherche en blockchain dédié au développement de l\'écosystème blockchain en Afrique. L\'ABI est notre partenaire fondateur et mentor.',
      website: 'https://africablockchain.institute/',
      email: 'contact@africablockchain.institute',
      phone: '+229 XX XX XX XX',
      logo: '/images/partners/abi.png',
      type: 'Institut de Formation'
    },
    {
      name: 'Tech BitDevs Cotonou & Bitcoin Benin',
      description: 'Communauté technique dédiée au développement Bitcoin et aux technologies blockchain en Afrique. Partenariat stratégique pour promouvoir l\'éducation et l\'adoption des cryptomonnaies au Bénin.',
      website: 'https://bitdevs.africa/',
      email: 'contact@bitdevs.africa',
      phone: '+229 XX XX XX XX',
      logo: '/images/partners/bitdevs-bitcoin-benin.png',
      type: 'Communauté Technique',
      partnershipDate: '23 Octobre 2025'
    }
  ];

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
              Nos <span className="text-gradient-web3">Partenaires</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
              Découvrez les institutions et organisations qui nous accompagnent dans notre mission.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BlockchainCard className="group hover:border-primary-500/30 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Logo and Basic Info */}
                    <div className="lg:col-span-1">
                      <div className="text-center lg:text-left">
                        <div className="w-28 h-28 bg-white/5 rounded-2xl mx-auto lg:mx-0 mb-6 flex items-center justify-center border border-white/10 group-hover:border-primary-500/40 transition-colors">
                          <img
                            src={partner.logo}
                            alt={partner.name}
                            className="w-20 h-20 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'block';
                            }}
                          />
                          <Globe className="w-12 h-12 text-gray-600 hidden" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                          {partner.name}
                        </h3>
                        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full border border-primary-500/50 text-primary-400 bg-primary-500/10 transition-colors">
                          {partner.type}
                        </span>
                      </div>
                    </div>

                    {/* Description and Links */}
                    <div className="lg:col-span-2 flex flex-col justify-center">
                      <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
                        {partner.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 border-t border-white/5 pt-8">
                        <div className="flex items-center space-x-4 group/item">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-primary-500/20 transition-colors">
                            <Mail className="w-5 h-5 text-gray-500 group-hover/item:text-primary-400" />
                          </div>
                          <a
                            href={`mailto:${partner.email}`}
                            className="text-gray-400 hover:text-primary-400 transition-colors font-medium"
                          >
                            {partner.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-4 group/item">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/item:bg-secondary-500/20 transition-colors">
                            <Phone className="w-5 h-5 text-gray-500 group-hover/item:text-secondary-400" />
                          </div>
                          <a
                            href={`tel:${partner.phone}`}
                            className="text-gray-400 hover:text-secondary-400 transition-colors font-medium"
                          >
                            {partner.phone}
                          </a>
                        </div>
                      </div>

                      <div>
                        <BlockchainButton
                          href={partner.website}
                          className="!inline-flex"
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Visiter le site web
                          <ExternalLink className="w-4 h-4 ml-2 opacity-50" />
                        </BlockchainButton>
                      </div>
                    </div>
                  </div>
                </BlockchainCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white/5 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Avantages de Nos <span className="text-gradient-web3">Partenariats</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Une collaboration gagnante-gagnante pour l'écosystème.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BlockchainCard className="text-center group">
              <div className="w-16 h-16 bg-primary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-500 transition-colors">
                <Globe className="w-8 h-8 text-primary-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Formation de Qualité</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Accès à des formations professionnelles dispensées par des experts reconnus mondialement.
              </p>
            </BlockchainCard>

            <BlockchainCard className="text-center group">
              <div className="w-16 h-16 bg-secondary-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary-500 transition-colors">
                <ExternalLink className="w-8 h-8 text-secondary-400 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Opportunités Pro</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Accès privilégié à des stages, emplois et projets innovants avec nos partenaires.
              </p>
            </BlockchainCard>

            <BlockchainCard className="text-center group">
              <div className="w-16 h-16 bg-primary-400/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-400 transition-colors">
                <Mail className="w-8 h-8 text-primary-300 group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Réseau Étendu</h3>
              <p className="text-gray-400 font-medium leading-relaxed">
                Connexion avec un réseau professionnel influent dans l'écosystème tech africain.
              </p>
            </BlockchainCard>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Devenir <span className="text-gradient-web3">Partenaire</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Vous souhaitez collaborer avec nous ? Découvrez comment contribuer à l'essor de la blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <BlockchainButton href="/contact" primary size="lg">
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

export default Partners;
