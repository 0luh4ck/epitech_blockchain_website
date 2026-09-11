import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import ClubLogo from '../ClubLogo';

/**
 * Layout STRICTEMENT isolé de l'espace d'administration.
 * Aucune Navbar ni Footer publics ne sont rendus ici : Sidebar fixe
 * + zone d'action principale (modale mot de passe, vues admin).
 */
const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-950">
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        onNavigate={(to) => navigate(to)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Barre supérieure mobile (la Sidebar est un tiroir sous lg) */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-slate-950 border-b border-white/10">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Ouvrir le menu d'administration"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
          >
            <Menu className="h-5 w-5" />
          </button>
          <ClubLogo className="h-8 w-auto object-contain" />
          <span className="text-xs font-black text-red-400 uppercase tracking-[0.2em]">
            Espace Admin
          </span>
        </div>

        {/* Zone d'action principale */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
