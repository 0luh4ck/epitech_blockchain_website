import React from 'react';
import { Users, Calendar, Target, Award, Globe, Heart } from 'lucide-react';

const About = () => {
  const milestones = [
    {
      date: '8 Août 2024',
      title: 'Fondation du Club',
      description: 'Création du Club Blockchain d\'Epitech Bénin suite à une formation de l\'Africa Blockchain Institute'
    },
    {
      date: '1er Septembre 2024',
      title: 'Premier Bureau Exécutif',
      description: 'Élection du premier bureau exécutif avec Soumaila CISSE comme Président'
    },
    {
      date: 'Juin 2025',
      title: 'Participation au BitCoin Mastermind 2025',
      description: 'Participation au BitCoin Mastermind 2025 organisé par BitDevs Cotonou et African Free Routers'
    },
    {
      date: '1er Septembre 2025',
      title: 'Nouveau Bureau 2025-2026',
      description: 'Transition vers le nouveau bureau exécutif dirigé par Brouhane BONI GOMINA'
    },
    {
      date: '4 Novembre 2025',
      title: '1er workshop technique pour les étudiants du Master à Epitech',
      description: 'Organisation du workshop introductif à la blockchain au profit des étudiants du Master 1 à Epitech Bénin'
    }
  ];

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: 'Nous encourageons l\'innovation et l\'exploration de nouvelles technologies blockchain'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Nous croyons en la force du travail d\'équipe et de la collaboration interdisciplinaire'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Nous visons l\'excellence dans tout ce que nous entreprenons et enseignons'
    },
    {
      icon: Globe,
      title: 'Impact Social',
      description: 'Nous nous engageons à utiliser la blockchain pour créer un impact positif sur la société'
    }
  ];

  const founders = [
    {
      name: 'Soumaila CISSE',
      role: '1er Président du Club',
      description: 'Visionnaire et leader, il a posé les fondations du club avec passion et détermination'
    },
    {
      name: 'Samuel SOGLOHOUN',
      role: '1er Secrétaire Général',
      description: 'Coordinateur actuel du Bureau Exécutif, il assure la continuité et le développement du club'
    },
    {
      name: 'Godwin BEWA',
      role: '1er Community Manager',
      description: 'Il a su créer et animer une communauté dynamique et engagée'
    },
    {
      name: 'Cynthia ZINSOU',
      role: '1ère Responsable Ressources Humaines',
      description: 'Elle a mis en place les structures de gestion des membres et des ressources'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              À Propos du Club
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez l'histoire, la mission et les valeurs qui guident notre communauté blockchain
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Le Club Blockchain d'Epitech Bénin a pour mission de promouvoir l'éducation et l'innovation 
                blockchain au Bénin et en Afrique. Nous créons un écosystème d'apprentissage où les étudiants 
                peuvent explorer, expérimenter et maîtriser les technologies blockchain émergentes.
              </p>
              <p className="text-lg text-gray-600">
                Notre objectif est de former la prochaine génération d'experts blockchain qui contribueront 
                au développement technologique et économique de notre continent.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                Nous aspirons à devenir le centre de référence pour l'éducation blockchain en Afrique de l'Ouest, 
                en créant des ponts entre l'éducation, l'industrie et l'innovation.
              </p>
              <p className="text-lg text-gray-600">
                Notre vision est de voir le Bénin et l'Afrique devenir des leaders mondiaux dans l'adoption 
                et le développement de solutions blockchain innovantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Notre Histoire
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Un parcours marqué par l'innovation, la collaboration et la passion pour la blockchain
            </p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-green-600 font-semibold mb-2">
                      {milestone.date}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les principes qui guident nos actions et notre engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Fondateurs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Les visionnaires qui ont donné naissance à notre communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {founders.map((founder, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {founder.name}
                </h3>
                <p className="text-green-600 font-medium mb-3">
                  {founder.role}
                </p>
                <p className="text-gray-600 text-sm">
                  {founder.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Rejoignez Notre Aventure
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Faites partie de cette communauté passionnante et contribuez à l'avenir de la blockchain en Afrique
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/membership"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Heart className="w-5 h-5 mr-2" />
              Rejoindre le Club
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors inline-flex items-center justify-center"
            >
              Nous Contacter
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
