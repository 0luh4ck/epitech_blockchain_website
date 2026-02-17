import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES, APP_CONFIG } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    club: [
      { name: 'À Propos', href: ROUTES.ABOUT },
      { name: 'Bureau Exécutif', href: ROUTES.EXECUTIVE_BOARD },
      { name: 'Partenaires', href: ROUTES.PARTNERS },
      { name: 'Activités', href: ROUTES.ACTIVITIES }
    ],
    participation: [
      { name: 'Adhésion', href: ROUTES.MEMBERSHIP },
      { name: 'Contact', href: ROUTES.CONTACT },
      { name: 'Connexion', href: ROUTES.LOGIN },
      { name: 'Demande d\'adhésion', href: ROUTES.MEMBERSHIP_REQUEST }
    ],
    partenaires: [
      { name: 'Epitech Bénin', href: 'https://epitech.africa/', external: true },
      { name: 'Future Studio', href: 'https://www.futurestudio.bj/', external: true },
      { name: 'Africa Blockchain Institute', href: 'https://africablockchain.institute/', external: true }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: APP_CONFIG.social.facebook },
    { name: 'Instagram', icon: Instagram, href: APP_CONFIG.social.instagram },
    { name: 'LinkedIn', icon: Linkedin, href: APP_CONFIG.social.linkedin },
    { name: 'Twitter', icon: Twitter, href: APP_CONFIG.social.twitter }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="ml-3 text-xl font-bold">
                Club Blockchain
              </span>
            </div>
            <p className="text-gray-300 text-sm mb-4">
              Promouvoir l'éducation et l'innovation blockchain au Bénin et en Afrique. 
              Rejoignez-nous pour explorer l'univers passionnant de la blockchain !
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Le Club */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Le Club</h3>
            <ul className="space-y-2">
              {footerLinks.club.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Participation</h3>
            <ul className="space-y-2">
              {footerLinks.participation.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className="w-4 h-4 mr-2 text-green-400" />
                <a
                  href={`mailto:${APP_CONFIG.contact.email}`}
                  className="hover:text-green-400 transition-colors"
                >
                  {APP_CONFIG.contact.email}
                </a>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className="w-4 h-4 mr-2 text-green-400" />
                <a
                  href={`tel:${APP_CONFIG.contact.phone}`}
                  className="hover:text-green-400 transition-colors"
                >
                  {APP_CONFIG.contact.phone}
                </a>
              </div>
              <div className="flex items-start text-gray-300 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                <span>{APP_CONFIG.contact.address}</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2">Nos Partenaires</h4>
              <ul className="space-y-1">
                {footerLinks.partenaires.map((partner) => (
                  <li key={partner.name}>
                    <a
                      href={partner.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-green-400 transition-colors text-xs"
                    >
                      {partner.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © {currentYear} {APP_CONFIG.name}. Tous droits réservés.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-green-400 transition-colors text-sm"
              >
                Politique de confidentialité
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-green-400 transition-colors text-sm"
              >
                Conditions d'utilisation
              </Link>
            </div>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs">
              Développé avec ❤️ par l'équipe du Club Blockchain d'Epitech Bénin
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
