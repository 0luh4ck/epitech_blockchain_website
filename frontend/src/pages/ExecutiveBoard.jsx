import React from 'react';
import { Users, Mail, Linkedin, Twitter } from 'lucide-react';
import MemberPhoto from '../components/MemberPhoto';

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
        return 'bg-red-100 text-red-800';
      case 'executive':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Bureau Exécutif 2025-2026
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rencontrez les membres passionnés qui dirigent notre club avec dévouement et expertise
            </p>
          </div>
        </div>
      </section>

      {/* Executive Members */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Équipe Dirigeante
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des leaders dévoués qui travaillent ensemble pour faire avancer notre mission
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="text-center mb-4">
                  <MemberPhoto 
                    name={member.name}
                    position={member.position}
                    imagePath={member.image}
                    className="mb-4"
                    showName={false}
                    showPosition={false}
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-green-600 font-semibold mb-2">
                    {member.position}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 text-center">
                  {member.bio}
                </p>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-center space-x-4">
                    <a
                      href={`mailto:${member.email}`}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Envoyer un email"
                    >
                      <Mail className="w-5 h-5" />
                    </a>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-600 transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-blue-400 transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Structure Organisationnelle
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une organisation claire et efficace pour maximiser notre impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Direction</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Président</li>
                <li>• Coordinateur du Bureau Exécutif</li>
                <li>• Secrétaire</li>
                <li>• Trésorière</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Pôles Opérationnels</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pôle Évènements et Partenariats</li>
                <li>• Pôle Tech</li>
                <li>• Pôle Communication</li>
                <li>• Pôle Pédago</li>
                <li>• Pôle Ressources Humaines</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Conseil</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Conseiller Pôle Tech et Pédago</li>
                <li>• Anciens membres du Bureau</li>
                <li>• Partenaires institutionnels</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contactez Notre Équipe
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Vous avez des questions ou souhaitez collaborer avec nous ? N'hésitez pas à nous contacter
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:contact@epitech-blockchain.bj"
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

export default ExecutiveBoard;
