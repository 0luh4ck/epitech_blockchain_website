import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, BookOpen, Award, Target, Globe, Zap, Shield, TrendingUp } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import BlockchainButton from '../components/BlockchainButton';
import BlockchainCard from '../components/BlockchainCard';
import ParticleGrid from '../components/ParticleGrid';
import { ROUTES } from '../utils/constants';
import { statsService } from '../services/stats';

/* ── Stat card ── */
const StatCard = ({ number, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6 rounded-2xl border border-primary-500/10 bg-white/50 dark:bg-white/3 backdrop-blur-sm hover:border-primary-500/30 hover:shadow-glow-cyan transition-all duration-300 group"
  >
    <div className="text-3xl md:text-4xl font-black text-primary-500 mb-2 font-heading tracking-tight group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
      {label}
    </div>
  </motion.div>
);

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoignez une communauté passionnée et apprenez des meilleurs experts du domaine.',
      glowColor: '#00d2ff',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Participez à des projets innovants et développez vos compétences techniques.',
      glowColor: '#7000ff',
    },
    {
      icon: Globe,
      title: 'Opportunités',
      description: 'Accédez à un réseau mondial et découvrez les opportunités du Web3.',
      glowColor: '#00d2ff',
    },
  ];

  const categories = [
    {
      icon: BookOpen,
      title: 'Formation',
      description: 'Découvrez les bases de la blockchain et apprenez à développer des smart contracts.',
      glowColor: '#7000ff',
    },
    {
      icon: Zap,
      title: 'Workshops',
      description: 'Participe à des ateliers pratiques pour maîtriser les outils et protocols de la blockchain.',
      glowColor: '#7000ff',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues et participez à nos examens pour valider vos compétences.',
      glowColor: '#00d2ff',
    },
  ];

  const [statsData, setStatsData] = React.useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await statsService.getDashboardStats();
        if (response.success) {
          setStatsData(response.data);
        }
      } catch (error) {
        console.error('Erreur stats home:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="relative min-h-screen bg-[#050505] text-slate-900 dark:text-white pt-20 overflow-hidden">
      {/* Background avec ParticleGrid réutilisable */}
      <ParticleGrid />

      {/* Glow Effects */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary-500/10 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-sm font-bold tracking-widest uppercase text-primary-400">Innovation & Futur</span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter leading-tight">
              L'avenir est <br />
              <span className="text-gradient-web3">Décentralisé</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 mb-12 max-w-3xl mx-auto font-medium">
              Rejoignez le <span className="text-white font-bold">Club Blockchain d'Epitech Bénin</span>.
              Explorez, apprenez et construisez la prochaine itération du web.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <BlockchainButton href={ROUTES.REGISTER} primary size="lg" className="w-full sm:w-auto">
                Rejoindre le Club
                <ArrowRight className="ml-2 w-5 h-5" />
              </BlockchainButton>
              <BlockchainButton href={ROUTES.ABOUT} size="lg" className="w-full sm:w-auto">
                Découvrir nos Missions
              </BlockchainButton>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="py-20 border-y border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number={statsData?.members || "30+"} label="Membres Actifs" delay={0.1} />
            <StatCard number={statsData?.activities || "12+"} label="Événements" delay={0.2} />
            <StatCard number={statsData?.partners || "4"} label="Partenaires" delay={0.3} />
            <StatCard number="2024" label="Fondation" delay={0.4} />
          </div>
        </div>

        {/* Features Selection */}
        <section className="py-32">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight">
              Pourquoi nous <span className="text-gradient-web3">rejoindre</span> ?
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-primary-500 to-secondary-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <BlockchainCard key={index} className="group">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:border-primary-500/50 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </BlockchainCard>
              );
            })}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-white/2 dark:bg-white/[0.02] rounded-[48px] px-8 md:px-20 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
                Apprenez les <br />
                <span className="text-gradient-web3">Technologies</span> de demain
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 font-medium">
                Nous proposons des programmes variés pour tous les niveaux, de l'initiation au développement avancé de smart contracts.
              </p>

              <div className="space-y-8">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <div key={i} className="flex items-start space-x-6">
                      <div className="mt-1 w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center shrink-0 border border-primary-500/20">
                        <Icon className="w-6 h-6 text-primary-500" />
                      </div>
                      <div>
                        <h4 className="text-xl font-extrabold text-white mb-2">{cat.title}</h4>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center p-8 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 opacity-40" />
                <img
                  src="/logo.png"
                  alt="Logo Club"
                  className="w-1/2 h-auto opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-40 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 blur-[100px] opacity-20" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tight leading-tight">
                Prêt à forger le <br />
                <span className="text-gradient-web3">Futur</span> avec nous ?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <BlockchainButton href={ROUTES.REGISTER} primary size="lg" className="w-full sm:w-auto px-12 py-6 text-xl">
                  Rejoindre Maintenant
                </BlockchainButton>
                <BlockchainButton href={ROUTES.PARTNERS} size="lg" className="w-full sm:w-auto px-12 py-6 text-xl">
                  Devenir Partenaire
                </BlockchainButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Footer minimaliste intégrée (Optionnel car il y a une Footer globale) */}
      <div className="py-12 border-t border-white/5 text-center relative z-10">
        <p className="text-slate-500 dark:text-slate-600 font-bold tracking-widest uppercase text-xs">
          © {new Date().getFullYear()} Club Blockchain Epitech Bénin
        </p>
      </div>
    </div>
  );
};

export default Home;
