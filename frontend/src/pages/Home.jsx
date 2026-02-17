import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, BookOpen, Award, Target, Globe } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import BlockchainEffects from '../components/BlockchainEffects';
import Card3D from '../components/Card3D';
import BlockchainButton from '../components/BlockchainButton';
import GlitchText from '../components/GlitchText';
import BlockchainCard from '../components/BlockchainCard';

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez une communauté dynamique d\'étudiants passionnés par la blockchain et les technologies émergentes.'
    },
    {
      icon: Calendar,
      title: 'Événements Réguliers',
      description: 'Participez à nos séminaires, conférences et ateliers pour approfondir vos connaissances en blockchain.'
    },
    {
      icon: BookOpen,
      title: 'Formation Continue',
      description: 'Bénéficiez de formations de qualité dispensées par des experts et nos partenaires institutionnels.'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues et participez à nos examens pour valider vos compétences.'
    }
  ];

  const stats = [
    { number: '30+', label: 'Membres Actifs' },
    { number: '20+', label: 'Événements à venir' },
    { number: '4', label: 'Partenaires Stratégiques' },
    { number: '100%', label: 'Satisfaction' }
  ];

  const executiveMembers = [
    {
      name: 'Brouhane BONI GOMINA',
      position: 'Président',
      image: '/images/executives/president.jpg'
    },
    {
      name: 'Samuel SOGLOHOUN',
      position: 'Coordonateur du Bureau Exécutif',
      image: '/images/executives/coordinator.jpg'
    },
    {
      name: 'Estelle GOSSOU',
      position: 'Secrétaire Générale',
      image: '/images/executives/secretary.jpg'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Effets de blockchain en arrière-plan */}
      <BlockchainEffects />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-20 overflow-hidden">
        {/* Effets de particules */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-ping opacity-40"></div>
          <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse opacity-70"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo Principal */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src="/images/logo/Epitech Blockchain Club Logo.jpg" 
                  alt="Logo Club Blockchain Epitech Bénin" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-2xl border-2 border-green-400"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/20 to-blue-400/20 animate-pulse"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <GlitchText text="Club Blockchain" className="block" glitchIntensity="low" />
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                Epitech Bénin
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Promouvoir l'éducation et l'innovation blockchain au Bénin et en Afrique. 
              Rejoignez-nous pour explorer l'univers passionnant de la blockchain !
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BlockchainButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = ROUTES.MEMBERSHIP_REQUEST}
                className="group"
              >
                <span className="flex items-center">
                  Rejoindre le Club
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </BlockchainButton>
              
              <BlockchainButton
                variant="outline"
                size="lg"
                onClick={() => window.location.href = ROUTES.ACTIVITIES}
                glowColor="#3B82F6"
                className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white"
              >
                Voir les Activités
              </BlockchainButton>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Rejoindre Notre Club ?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les avantages de faire partie de notre communauté blockchain
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <BlockchainCard
                  key={index}
                  icon={Icon}
                  title={feature.title}
                  description={feature.description}
                  glowColor={index % 2 === 0 ? '#10B981' : '#3B82F6'}
                  className="h-full"
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive Board Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Bureau Exécutif 2025-2026
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rencontrez les membres qui dirigent notre club avec passion et dévouement
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {executiveMembers.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-green-600 font-medium">
                  {member.position}
                </p>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link
              to={ROUTES.EXECUTIVE_BOARD}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center"
            >
              Voir Tous les Membres
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Partenaires Stratégiques
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nous collaborons avec des institutions de renom pour offrir la meilleure expérience
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Epitech Bénin
              </h3>
              <p className="text-gray-600 mb-4">
                École d'informatique et d'innovation technologique
              </p>
              <a
                href="https://epitech.africa/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Visiter le site →
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Future Studio
              </h3>
              <p className="text-gray-600 mb-4">
                Studio d'innovation et de développement technologique
              </p>
              <a
                href="https://www.futurestudio.bj/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Visiter le site →
              </a>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Africa Blockchain Institute
              </h3>
              <p className="text-gray-600 mb-4">
                Institut de formation et de recherche en blockchain
              </p>
              <a
                href="https://africablockchain.institute/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Visiter le site →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à Rejoindre l'Aventure Blockchain ?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté et participez à la révolution blockchain au Bénin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.MEMBERSHIP}
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              Devenir Membre
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to={ROUTES.CONTACT}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              Nous Contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
