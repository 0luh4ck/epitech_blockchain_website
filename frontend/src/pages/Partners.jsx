import React from 'react';
import { ExternalLink, Globe, Mail, Phone } from 'lucide-react';

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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Nos Partenaires
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les institutions et organisations qui nous accompagnent dans notre mission
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {partners.map((partner, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Logo and Basic Info */}
                  <div className="lg:col-span-1">
                    <div className="text-center lg:text-left">
                      <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto lg:mx-0 mb-4 flex items-center justify-center">
                        <Globe className="w-12 h-12 text-gray-400" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {partner.name}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                        {partner.type}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="lg:col-span-2">
                    <p className="text-gray-600 text-lg mb-6">
                      {partner.description}
                    </p>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-green-600" />
                        <a
                          href={`mailto:${partner.email}`}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                        >
                          {partner.email}
                        </a>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-green-600" />
                        <a
                          href={`tel:${partner.phone}`}
                          className="text-gray-600 hover:text-green-600 transition-colors"
                        >
                          {partner.phone}
                        </a>
                      </div>
                    </div>

                    {/* Website Link */}
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Visiter le site
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Avantages de Nos Partenariats
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nos partenariats stratégiques nous permettent d'offrir une expérience enrichie à nos membres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Formation de Qualité
              </h3>
              <p className="text-gray-600">
                Accès à des formations professionnelles dispensées par des experts reconnus
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Opportunités Professionnelles
              </h3>
              <p className="text-gray-600">
                Accès à des stages, emplois et projets avec nos partenaires institutionnels
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Réseau Étendu
              </h3>
              <p className="text-gray-600">
                Connexion avec un réseau professionnel étendu dans l'écosystème tech béninois
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Devenir Partenaire
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Vous souhaitez collaborer avec nous ? Découvrez comment devenir partenaire du Club Blockchain
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center"
            >
              <Mail className="w-5 h-5 mr-2" />
              Nous Contacter
            </a>
            <a
              href="/membership"
              className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors inline-flex items-center justify-center"
            >
              Rejoindre le Club
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partners;
