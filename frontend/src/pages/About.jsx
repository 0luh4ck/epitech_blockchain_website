import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, BookOpen, Shield, Globe, Award, Zap, Code, Terminal, Cpu } from 'lucide-react';
import ParticleGrid from '../components/ParticleGrid';
import BlockchainCard from '../components/BlockchainCard';

const About = () => {
  const missions = [
    {
      icon: Target,
      title: 'Notre Mission',
      description: 'Démocratiser la technologie blockchain et former la prochaine génération de leaders du Web3 au Bénin.'
    },
    {
      icon: Users,
      title: 'Notre Vision',
      description: 'Devenir le hub d\'excellence de l\'innovation décentralisée en Afrique de l\'Ouest.'
    },
    {
      icon: Shield,
      title: 'Nos Valeurs',
      description: 'Intégrité, collaboration, innovation constante et souveraineté technologique.'
    }
  ];

  const values = [
    {
      icon: Code,
      title: 'Développement Clean',
      description: 'Nous mettons l\'accent sur la qualité du code et la sécurité des protocoles.'
    },
    {
      icon: Terminal,
      title: 'Open Source',
      description: 'Nous croyons au partage et à la transparence du savoir technologique.'
    },
    {
      icon: Cpu,
      title: 'Innovation Hardware',
      description: 'Exploration de l\'intersection entre l\'IoT et la Blockchain.'
    }
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-slate-50/50 border-b border-slate-100">
        <ParticleGrid />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-slate-900">
              Architectes du <span className="text-gradient-web3">Futur</span>
            </h1>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto font-medium leading-relaxed">
              Le Club Blockchain Epitech Bénin est un laboratoire d'innovation où les étudiants explorent les frontières de la décentralisation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {missions.map((mission, index) => {
              const Icon = mission.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-10 rounded-[32px] bg-slate-50/30 border border-slate-100 hover:bg-white hover:shadow-xl transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-slate-900">{mission.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{mission.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-black mb-4">Nos Piliers Techniques</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <BlockchainCard key={i} title={v.title} description={v.description} icon={Icon} glowColor="#10b981" />
              );
            })}
          </div>
        </div>
      </section>

      {/* History/Timeline Section */}
      <section className="py-32 bg-slate-900 text-white rounded-t-[64px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black mb-8 leading-tight">Fondé sur <br /><span className="text-blue-400">l'Excellence</span></h2>
              <div className="space-y-12">
                <div className="flex gap-8 relative pl-6 border-l border-blue-600/30">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">2024 - Création</h4>
                    <p className="text-slate-400 font-medium leading-relaxed">Naissance du club avec une vision claire : mettre Epitech Bénin sur la carte mondiale de la blockchain.</p>
                  </div>
                </div>
                <div className="flex gap-8 relative pl-6 border-l border-blue-600/30">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  <div>
                    <h4 className="text-xl font-bold mb-2">Expansion</h4>
                    <p className="text-slate-400 font-medium leading-relaxed">Lancement des premiers workshops techniques et partenariats stratégiques avec les leaders du secteur au Bénin.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5 p-12">
                <div className="h-full w-full flex items-center justify-center">
                  <Zap className="w-24 h-24 text-blue-500 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
