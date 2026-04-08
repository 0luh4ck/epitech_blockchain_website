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
    className="text-center p-8 rounded-3xl border border-slate-100 bg-white/50 backdrop-blur-sm hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
  >
    <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2 font-heading tracking-tight group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
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
      glowColor: '#3b82f6',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Participez à des projets innovants et développez vos compétences techniques.',
      glowColor: '#10b981',
    },
    {
      icon: Globe,
      title: 'Opportunités',
      description: 'Accédez à un réseau mondial et découvrez les opportunités du Web3.',
      glowColor: '#3b82f6',
    },
  ];

  const categories = [
    {
      icon: BookOpen,
      title: 'Formation',
      description: 'Découvrez les bases de la blockchain et apprenez à développer des smart contracts.',
      glowColor: '#10b981',
    },
    {
      icon: Zap,
      title: 'Workshops',
      description: 'Participe à des ateliers pratiques pour maîtriser les outils et protocols de la blockchain.',
      glowColor: '#3b82f6',
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Obtenez des certifications reconnues et participez à nos examens pour valider vos compétences.',
      glowColor: '#10b981',
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
    <div className="relative min-h-screen bg-white text-slate-900 pt-20 overflow-hidden">
      {/* Background avec ParticleGrid réutilisable */}
      <ParticleGrid />

      {/* Glow Effects (Subtle for Light Mode) */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/5 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Section */}
        <div className="py-24 md:py-40 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span className="text-xs font-bold tracking-widest uppercase text-blue-600">Innovation & Futur</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-[1.1] text-slate-900">
              L'avenir sera <br />
              <span className="text-gradient-web3">Éclatant</span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-500 mb-14 max-w-3xl mx-auto font-medium leading-relaxed">
              Rejoignez le <span className="text-blue-600 font-bold">Club Blockchain d'Epitech Bénin</span>.
              Explorez, apprenez et construisez la prochaine itération souveraine du web.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <BlockchainButton onClick={() => window.location.href = ROUTES.REGISTER} primary size="lg" className="w-full sm:w-auto px-10">
                Rejoindre le Club
                <ArrowRight className="ml-2 w-5 h-5" />
              </BlockchainButton>
              <BlockchainButton onClick={() => window.location.href = ROUTES.ABOUT} variant="secondary" size="lg" className="w-full sm:w-auto px-10">
                Nos Missions
              </BlockchainButton>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <div className="py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number={statsData?.members || "30+"} label="Membres Actifs" delay={0.1} />
            <StatCard number={statsData?.activities || "12+"} label="Événements" delay={0.2} />
            <StatCard number={statsData?.partners || "4"} label="Partenaires" delay={0.3} />
            <StatCard number="2024" label="Fondation" delay={0.4} />
          </div>
        </div>

        {/* Features selection */}
        <section className="py-32">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900">
              Pourquoi nous <span className="text-gradient-web3">rejoindre</span> ?
            </h2>
            <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-green-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <BlockchainCard key={index} className="group" glowColor={feature.glowColor}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-black mb-4 text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{feature.title}</h3>
                    <p className="text-base font-medium text-slate-500 leading-relaxed italic">
                      "{feature.description}"
                    </p>
                  </div>
                </BlockchainCard>
              );
            })}
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-32 bg-slate-50/50 rounded-[64px] px-8 md:px-24 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-blue-50/20 to-transparent pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-slate-900 tracking-tighter">
                Maîtrisez les <br />
                <span className="text-gradient-web3">Protocoles</span> du futur
              </h2>
              <p className="text-lg text-slate-600 mb-12 font-medium leading-relaxed">
                De l'initiation technique aux architectures complexes de smart contracts, nous couvrons tous les piliers de la décentralisation.
              </p>

              <div className="space-y-10">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  return (
                    <div key={i} className="flex items-start space-x-8 group">
                      <div className="mt-1 w-14 h-14 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-slate-100 shadow-md group-hover:border-blue-200 group-hover:scale-110 transition-all">
                        <Icon className="w-7 h-7 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-slate-900 mb-2">{cat.title}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[40px] overflow-hidden border border-white shadow-2xl bg-white flex items-center justify-center p-12 group transition-all duration-700 hover:rotate-2">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-green-500/5 opacity-50" />
                <img
                  src="/logo.png"
                  alt="Logo Club"
                  className="w-2/3 h-auto grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
              </div>
              {/* Floating elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-48 text-center">
          <div className="relative inline-block max-w-4xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-500/10 blur-[100px] opacity-30" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <h2 className="text-5xl md:text-8xl font-black mb-12 tracking-tighter leading-tight text-slate-900">
                Bâtissons le <br />
                <span className="text-gradient-web3">Web Social</span> de demain
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <BlockchainButton onClick={() => window.location.href = ROUTES.REGISTER} primary size="xl" className="w-full sm:w-auto px-16 shadow-2xl shadow-blue-500/20">
                  Nous rejoindre
                </BlockchainButton>
                <BlockchainButton onClick={() => window.location.href = ROUTES.PARTNERS} variant="secondary" size="xl" className="w-full sm:w-auto px-16 border-slate-200">
                  Partenariat
                </BlockchainButton>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      <div className="py-16 border-t border-slate-100 text-center relative z-10 bg-slate-50/30">
        <p className="text-slate-400 font-bold tracking-[0.2em] uppercase text-xs">
          © {new Date().getFullYear()} Club Blockchain Epitech Bénin
        </p>
      </div>
    </div>
  );
};

export default Home;
