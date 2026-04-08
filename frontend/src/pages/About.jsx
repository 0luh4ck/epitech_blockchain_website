import React from 'react';
import { Users, Calendar, Target, Award, Globe, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainButton from '../components/BlockchainButton';
import BlockchainCard from '../components/BlockchainCard';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
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
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="/logo.png"
                  alt="Logo Club Blockchain Epitech Bénin"
                  className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover border border-white/10"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              À Propos du <span className="text-gradient-web3">Club Blockchain</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-medium">
              Découvrez l'histoire, la mission et les valeurs qui guident notre communauté vers l'avenir décentralisé.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gradient-web3 inline-block">Notre Mission</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Le Club Blockchain d'Epitech Bénin a pour mission de promouvoir l'éducation et l'innovation
                blockchain au Bénin et en Afrique. Nous créons un écosystème d'apprentissage où les étudiants
                peuvent explorer, expérimenter et maîtriser les technologies blockchain émergentes.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Notre objectif est de former la prochaine génération d'experts blockchain qui contribueront
                au développement technologique et économique de notre continent.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gradient-web3 inline-block">Notre Vision</h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Nous aspirons à devenir le centre de référence pour l'éducation blockchain en Afrique de l'Ouest,
                en créant des ponts entre l'éducation, l'industrie et l'innovation.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Notre vision est de voir le Bénin et l'Afrique devenir des leaders mondiaux dans l'adoption
                et le développement de solutions blockchain innovantes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Notre <span className="text-gradient-web3">Histoire</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Un parcours marqué par l'innovation et la passion.
            </p>
          </div>

          <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary-500/20 before:to-transparent">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-primary-500/50 bg-black text-primary-500 shadow grow-0 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors group-hover:bg-primary-500 group-hover:text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm group-hover:border-primary-500/30 transition-all duration-300">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-primary-400">{milestone.date}</div>
                  </div>
                  <div className="text-xl font-bold text-white mb-1">{milestone.title}</div>
                  <div className="text-gray-400 font-medium">{milestone.description}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Nos <span className="text-gradient-web3">Valeurs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Les principes qui guident nos actions.
            </p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={index} variants={itemVariants}>
                  <BlockchainCard className="h-full group hover:translate-y-[-8px] transition-transform duration-300">
                    <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-7 h-7 text-primary-400 group-hover:text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-400 font-medium leading-relaxed">
                      {value.description}
                    </p>
                  </BlockchainCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Founders */}
      <section className="py-24 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Nos <span className="text-gradient-web3">Fondateurs</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto font-medium">
              Les visionnaires à l'origine de cette aventure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <BlockchainCard className="text-center h-full group">
                  <div className="w-20 h-20 bg-white/5 rounded-full mx-auto mb-6 flex items-center justify-center border border-white/10 group-hover:border-primary-500/50 transition-colors">
                    <Users className="w-10 h-10 text-gray-500 group-hover:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {founder.name}
                  </h3>
                  <p className="text-primary-400 font-semibold mb-3 text-sm tracking-uppercase">
                    {founder.role}
                  </p>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    {founder.description}
                  </p>
                </BlockchainCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/20 to-secondary-900/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
            Rejoignez <span className="text-gradient-web3">l'Aventure</span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            Faites partie de cette communauté passionnante et contribuez à l'avenir de la blockchain en Afrique.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <BlockchainButton href="/membership" primary size="lg">
              <Heart className="w-5 h-5 mr-2" />
              Rejoindre le Club
            </BlockchainButton>
            <BlockchainButton href="/contact" size="lg">
              Nous Contacter
            </BlockchainButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
