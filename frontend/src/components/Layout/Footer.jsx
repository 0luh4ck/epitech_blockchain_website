import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin, Zap, ChevronRight } from 'lucide-react';
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
      { name: 'Connexion', href: ROUTES.LOGIN }
    ],
    commu: [
      { name: 'Epitech Bénin', href: 'https://epitech.africa/', external: true },
      { name: 'Future Studio', href: 'https://www.futurestudio.bj/', external: true },
      { name: 'Africa Blockchain', href: '#', external: true },
    ]
  };

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to={ROUTES.HOME} className="flex items-center group mb-8">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center group-hover:border-blue-200 transition-all">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              </div>
              <div className="ml-4">
                <span className="block text-sm font-black text-slate-900 uppercase tracking-tighter">Club Blockchain</span>
                <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">Epitech Bénin</span>
              </div>
            </Link>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8">
              L'excellence technologique au service de la décentralisation. Formons ensemble le futur du Web3 en Afrique.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav Columns */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-l-2 border-blue-600 pl-4">Navigation</h4>
            <ul className="space-y-4">
              {footerLinks.club.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors flex items-center group">
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-l-2 border-green-500 pl-4">Participation</h4>
            <ul className="space-y-4">
              {footerLinks.participation.map((link, i) => (
                <li key={i}>
                  <Link to={link.href} className="text-sm font-bold text-slate-500 hover:text-green-500 transition-colors flex items-center group">
                    <ChevronRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 border-l-2 border-slate-900 pl-4">Contact</h4>
            <div className="space-y-6">
              <a href="mailto:contact@epitech-blockchain.bj" className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center group-hover:border-blue-200 transition-all">
                  <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                </div>
                <span className="text-sm font-bold text-slate-600 truncate">contact@epitech-blockchain.bj</span>
              </a>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-600">Cotonou, Bénin</span>
              </div>
            </div>

            <div className="mt-10">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Partenaires</h5>
              <div className="flex flex-wrap gap-3">
                {footerLinks.commu.map((p, i) => (
                  <a key={i} href={p.href} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase transition-colors">{p.name}</a>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
            © {currentYear} Club Blockchain Epitech Bénin
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Confidentialité</a>
            <a href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Mentions Légales</a>
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Bâtissons le futur ensemble
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
