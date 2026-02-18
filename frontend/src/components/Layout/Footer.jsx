import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Zap } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    club: [
      { name: 'À Propos', href: ROUTES.ABOUT },
      { name: 'Bureau Exécutif', href: ROUTES.EXECUTIVE_BOARD },
      { name: 'Partenaires', href: ROUTES.PARTNERS },
      { name: 'Activités', href: ROUTES.ACTIVITIES },
    ],
    participation: [
      { name: 'Adhésion', href: ROUTES.MEMBERSHIP },
      { name: 'Contact', href: ROUTES.CONTACT },
      { name: 'Connexion', href: ROUTES.LOGIN },
      { name: "Demande d'adhésion", href: ROUTES.MEMBERSHIP_REQUEST },
    ],
    partenaires: [
      { name: 'Epitech Bénin', href: 'https://epitech.africa/', external: true },
      { name: 'Future Studio', href: 'https://www.futurestudio.bj/', external: true },
      { name: 'Africa Blockchain Institute', href: 'https://africablockchain.institute/', external: true },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: APP_CONFIG.social?.facebook || '#' },
    { name: 'Instagram', icon: Instagram, href: APP_CONFIG.social?.instagram || '#' },
    { name: 'LinkedIn', icon: Linkedin, href: APP_CONFIG.social?.linkedin || '#' },
    { name: 'Twitter', icon: Twitter, href: APP_CONFIG.social?.twitter || '#' },
  ];

  return (
    <footer className="relative bg-[#050505] border-t border-white/5">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,210,255,0.4), rgba(112,0,255,0.4), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center gap-3 mb-5 group">
              <div className="relative w-10 h-10 flex-shrink-0">
                <img
                  src="/images/logo/Epitech Blockchain Club Logo.jpg"
                  alt="Club Blockchain Epitech"
                  className="w-10 h-10 rounded-lg object-cover"
                  style={{ border: '1px solid rgba(0,210,255,0.3)' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="hidden w-10 h-10 rounded-lg items-center justify-center text-white"
                  style={{ background: 'linear-gradient(135deg, #00d2ff, #7000ff)' }}
                >
                  <Zap className="w-5 h-5" />
                </div>
              </div>
              <span className="font-heading font-bold text-white group-hover:text-primary-400 transition-colors">
                Club Blockchain
              </span>
            </Link>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Promouvoir l'éducation et l'innovation blockchain au Bénin et en Afrique.
              Rejoignez-nous pour explorer l'univers du Web3 !
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-600 hover:text-primary-400 transition-all duration-200"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.border = '1px solid rgba(0,210,255,0.3)';
                      e.currentTarget.style.background = 'rgba(0,210,255,0.05)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.border = '1px solid rgba(255,255,255,0.06)';
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Le Club */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-white mb-5 uppercase tracking-wider">
              Le Club
            </h3>
            <ul className="space-y-3">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participation */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-white mb-5 uppercase tracking-wider">
              Participation
            </h3>
            <ul className="space-y-3">
              {footerLinks.participation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-500 hover:text-primary-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-heading font-semibold text-white mb-5 uppercase tracking-wider">
              Contact
            </h3>
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${APP_CONFIG.contact?.email}`}
                className="flex items-center gap-3 text-sm text-gray-500 hover:text-primary-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-primary-500 flex-shrink-0" />
                {APP_CONFIG.contact?.email}
              </a>
              <a
                href={`tel:${APP_CONFIG.contact?.phone}`}
                className="flex items-center gap-3 text-sm text-gray-500 hover:text-primary-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-500 flex-shrink-0" />
                {APP_CONFIG.contact?.phone}
              </a>
              <div className="flex items-start gap-3 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                <span>{APP_CONFIG.contact?.address}</span>
              </div>
            </div>

            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3">
              Partenaires
            </h4>
            <ul className="space-y-2">
              {footerLinks.partenaires.map((partner) => (
                <li key={partner.name}>
                  <a
                    href={partner.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-600 hover:text-primary-400 transition-colors"
                  >
                    {partner.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            © {currentYear} {APP_CONFIG.name}. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="text-xs text-gray-600 hover:text-primary-400 transition-colors">
              Conditions
            </Link>
          </div>
        </div>
        <div className="text-center mt-4">
          <p className="text-xs text-gray-700">
            Développé avec ❤️ par l'équipe du Club Blockchain d'Epitech Bénin
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
