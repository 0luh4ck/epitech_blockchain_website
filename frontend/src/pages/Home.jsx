import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, BookOpen, Award, Target, Globe, Zap, Shield, TrendingUp } from 'lucide-react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ROUTES } from '../utils/constants';
import { statsService } from '../services/stats';
import BlockchainButton from '../components/BlockchainButton';
import BlockchainCard from '../components/BlockchainCard';

/* ── Animated particle grid background ── */
const ParticleGrid = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        color: Math.random() > 0.5 ? '#00d2ff' : '#7000ff',
        opacity: Math.random() * 0.5 + 0.2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();
      });

      // Draw connections
      ctx.globalAlpha = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = '#00d2ff';
            ctx.globalAlpha = (1 - dist / 120) * 0.15;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  );
};

/* ── Stat card ── */
const StatCard = ({ number, label, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="text-center p-6 rounded-2xl border border-primary-500/10 bg-white/50 dark:bg-white/3 backdrop-blur-sm hover:border-primary-500/30 hover:shadow-glow-cyan transition-all duration-300 group"
  >
    <div className="text-3xl md:text-4xl font-heading font-black text-gradient-web3 mb-1 group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</div>
  </motion.div>
);

const Home = () => {
  const features = [
    {
      icon: Users,
      title: 'Communauté Active',
      description: 'Rejoignez une communauté dynamique d\'étudiants passionnés par la blockchain et les technologies émergentes.',
      glowColor: '#00d2ff',
    },
    {
      icon: Calendar,
      title: 'Événements Réguliers',
      description: 'Participez à nos séminaires, conférences et ateliers pour approfondir vos connaissances en blockchain.',
      glowColor: '#7000ff',
    },
    {
      icon: BookOpen,
      title: 'Formation Continue',
      description: 'Bénéficiez de formations de qualité dispensées par des experts et nos partenaires institutionnels.',
      glowColor: '#00ff99',
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

  const stats = [
    { number: statsData ? `${statsData.activeMembers}` : '30+', label: 'Membres Actifs' },
    { number: statsData ? `${statsData.upcomingActivities}` : '5+', label: 'Activités' },
    { number: '4', label: 'Partenaires' },
    { number: '100%', label: 'Satisfaction' },
  ];

  const executiveMembers = [
    { name: 'Brouhane BONI GOMINA', position: 'Président', initials: 'BB' },
    { name: 'Samuel SOGLOHOUN', position: 'Coordonateur', initials: 'SS' },
    { name: 'Estelle GOSSOU', position: 'Secrétaire Générale', initials: 'EG' },
  ];

  const partners = [
    { name: 'Epitech Bénin', desc: 'École d\'informatique et d\'innovation technologique', href: 'https://epitech.africa/', icon: Globe, color: '#00d2ff' },
    { name: 'Future Studio', desc: 'Studio d\'innovation et de développement technologique', href: 'https://www.futurestudio.bj/', icon: Zap, color: '#7000ff' },
    { name: 'Africa Blockchain Institute', desc: 'Institut de formation et de recherche en blockchain', href: 'https://africablockchain.institute/', icon: Shield, color: '#00ff99' },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#050505]">
        {/* Particle network */}
        <ParticleGrid />

        {/* Radial gradient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #00d2ff, transparent)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7000ff, transparent)' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-primary-400 border border-primary-500/30 bg-primary-500/5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            Club Blockchain Epitech Bénin
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <img
                src="../public/logo.png"
                alt="Logo Club Blockchain Epitech Bénin"
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover shadow-2xl"
                style={{ border: '2px solid rgba(0,210,255,0.4)', boxShadow: '0 0 40px rgba(0,210,255,0.3), 0 0 80px rgba(112,0,255,0.15)' }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              {/* Fallback */}
              <div
                className="hidden w-28 h-28 md:w-36 md:h-36 rounded-2xl items-center justify-center text-white font-bold text-4xl shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
                  boxShadow: '0 0 40px rgba(0,210,255,0.3)',
                }}
              >
                ⛓
              </div>
              {/* Animated ring */}
              <div className="absolute -inset-2 rounded-2xl animate-ping opacity-20"
                style={{ border: '1px solid #00d2ff' }} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl md:text-7xl font-heading font-black text-white mb-6 leading-tight"
          >
            Club{' '}
            <span className="text-gradient-web3">Blockchain</span>
            <br />
            <span className="text-white/90">Epitech Bénin</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Promouvoir l'éducation et l'innovation blockchain au Bénin et en Afrique.
            Rejoignez-nous pour explorer l'univers passionnant du Web3 !
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <BlockchainButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = ROUTES.MEMBERSHIP_REQUEST}
            >
              Rejoindre le Club
              <ArrowRight className="w-5 h-5" />
            </BlockchainButton>
            <BlockchainButton
              variant="outline"
              size="lg"
              onClick={() => window.location.href = ROUTES.ACTIVITIES}
            >
              Voir les Activités
            </BlockchainButton>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-gray-600 tracking-widest uppercase">Découvrir</span>
            <div className="w-px h-8 bg-gradient-to-b from-primary-500/50 to-transparent animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-16 bg-[var(--bg-secondary)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <StatCard key={i} {...stat} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-400 bg-primary-500/10 border border-primary-500/20 rounded-full mb-4 tracking-wider uppercase">
              Pourquoi nous rejoindre
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-gray-900 dark:text-white mb-4">
              Les Avantages du Club
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez les avantages de faire partie de notre communauté blockchain
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <BlockchainCard
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  glowColor={feature.glowColor}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EXECUTIVE BOARD PREVIEW
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--bg-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-secondary-400 bg-secondary-500/10 border border-secondary-500/20 rounded-full mb-4 tracking-wider uppercase">
              Leadership
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-gray-900 dark:text-white mb-4">
              Notre Bureau Exécutif
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Rencontrez les membres qui dirigent notre club avec passion et dévouement
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {executiveMembers.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center group"
              >
                <div className="relative inline-block mb-5">
                  <img
                    src={`/images/executives/${member.name.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto"
                    style={{ border: '2px solid rgba(0,210,255,0.3)' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div
                    className="hidden w-28 h-28 rounded-full mx-auto items-center justify-center text-white font-bold text-2xl font-heading"
                    style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                  >
                    {member.initials}
                  </div>
                  <div className="absolute -inset-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(135deg, #00d2ff30, #7000ff30)', filter: 'blur(8px)' }} />
                </div>
                <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-gradient-web3">{member.position}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link to={ROUTES.EXECUTIVE_BOARD}>
              <BlockchainButton variant="outline" size="md">
                Voir Tous les Membres
                <ArrowRight className="w-4 h-4" />
              </BlockchainButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PARTNERS SECTION
      ══════════════════════════════════════════ */}
      <section className="py-24 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold text-neon-500 bg-neon-500/10 border border-neon-500/20 rounded-full mb-4 tracking-wider uppercase">
              Écosystème
            </span>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-gray-900 dark:text-white mb-4">
              Nos Partenaires Stratégiques
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Nous collaborons avec des institutions de renom pour offrir la meilleure expérience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {partners.map((partner, i) => {
              const Icon = partner.icon;
              return (
                <motion.a
                  key={i}
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group block p-8 rounded-2xl border transition-all duration-300 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(0,210,255,0.1)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${partner.color}40`;
                    e.currentTarget.style.boxShadow = `0 0 30px ${partner.color}15`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = '1px solid rgba(0,210,255,0.1)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5"
                    style={{ background: `${partner.color}15`, border: `1px solid ${partner.color}30` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: partner.color }} />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-gray-900 dark:text-white mb-2">
                    {partner.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{partner.desc}</p>
                  <span className="text-sm font-medium transition-colors duration-200" style={{ color: partner.color }}>
                    Visiter le site →
                  </span>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA SECTION
      ══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #050505, #0a0a2e, #050505)' }} />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl"
            style={{ background: 'radial-gradient(circle, #00d2ff, transparent)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-15 blur-3xl"
            style={{ background: 'radial-gradient(circle, #7000ff, transparent)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-6">
              Prêt à Rejoindre{' '}
              <span className="text-gradient-web3">l'Aventure</span> ?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Rejoignez notre communauté et participez à la révolution blockchain au Bénin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.MEMBERSHIP}>
                <BlockchainButton variant="primary" size="lg">
                  Devenir Membre
                  <ArrowRight className="w-5 h-5" />
                </BlockchainButton>
              </Link>
              <Link to={ROUTES.CONTACT}>
                <BlockchainButton variant="outline" size="lg">
                  Nous Contacter
                </BlockchainButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
