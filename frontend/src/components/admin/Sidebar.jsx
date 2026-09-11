import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  PenSquare,
  Settings,
  ShieldCheck,
  LogOut,
  X,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

const MENU = [
  { label: 'Tableau de bord', href: ROUTES.ADMIN, icon: LayoutDashboard },
  { label: 'Demandes en attente', href: '/admin/membership-requests', icon: Inbox },
  { label: 'Gestion des membres', href: ROUTES.ADMIN, icon: Users },
  { label: 'Création activités / QCM', href: '/admin/activity-editor', icon: PenSquare },
  { label: 'Paramètres & Sécurité', href: ROUTES.PROFILE, icon: Settings },
];

const roleLabel = (role) => {
  if (role === 'admin' || role === 'superadmin') return 'Superadmin';
  if (role === 'executive') return 'Bureau Exécutif';
  return 'Membre';
};

const Sidebar = ({ mobileOpen, onClose, onNavigate }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  // Repli desktop : icons-only (le tiroir mobile reste pleine largeur)
  const [collapsed, setCollapsed] = useState(false);

  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase() || 'A';

  const handleLogout = () => {
    logout();
    onNavigate?.(ROUTES.HOME);
    onClose?.();
  };

  const linkClass = (href) => {
    const active =
      href === ROUTES.ADMIN
        ? location.pathname === ROUTES.ADMIN
        : location.pathname.startsWith(href);
    return `flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm font-bold transition-all duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-red-400 ${
      collapsed ? 'lg:justify-center lg:px-2' : ''
    } ${
      active
        ? 'bg-red-500/15 text-red-300 border border-red-500/30'
        : 'text-slate-400 hover:text-white hover:bg-white/5 hover:-translate-y-0.5 border border-transparent'
    }`;
  };

  // Libellés masqués en mode replié (desktop uniquement)
  const labelClass = collapsed ? 'lg:hidden' : '';

  return (
    <>
      {/* Overlay mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static z-50 inset-y-0 left-0 ${collapsed ? 'w-72 lg:w-20' : 'w-72'} shrink-0 bg-slate-950 border-r border-white/10 flex flex-col min-h-screen transition-all duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Branding */}
        <div className="flex items-center gap-3 px-5 pt-6 pb-5 border-b border-white/10">
          <img
            src="/logo.png"
            alt="Epitech Blockchain Club Logo"
            className="h-10 w-auto object-contain rounded-lg bg-white/5 border border-white/10 p-1 shrink-0"
          />
          <div className={`min-w-0 ${labelClass}`}>
            <p className="text-sm font-black text-white uppercase tracking-tight truncate">Club Blockchain</p>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.2em]">Espace Admin</p>
          </div>
          {/* Repli desktop */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Déplier la barre latérale' : 'Replier la barre latérale'}
            title={collapsed ? 'Déplier' : 'Replier'}
            className="ml-auto hidden lg:flex p-2 min-w-[44px] min-h-[44px] items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
          >
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </button>
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="ml-auto lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profil admin connecté */}
        <div className={`${collapsed ? 'px-3' : 'px-5'} py-4 border-b border-white/10`}>
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 ${collapsed ? 'lg:justify-center lg:p-2' : ''}`}
            title={user?.email || 'Accès restreint'}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-500 to-amber-500 flex items-center justify-center text-white font-black text-sm shrink-0">
              {initials}
            </div>
            <div className={`min-w-0 ${labelClass}`}>
              <p className="text-sm font-black text-white truncate">
                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrateur' : 'Non connecté'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email || 'Accès restreint'}</p>
              {user && (
                <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-black uppercase tracking-widest text-red-300">
                  <ShieldCheck className="h-3 w-3" />
                  {roleLabel(user.role)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation contextuelle */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1.5">
          {MENU.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              title={collapsed ? item.label : undefined}
              className={linkClass(item.href)}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={labelClass}>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Déconnexion */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            title={collapsed ? 'Déconnexion' : undefined}
            className={`w-full flex items-center gap-3 px-4 py-3 min-h-[44px] rounded-xl text-sm font-black text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-red-400 ${collapsed ? 'lg:justify-center lg:px-2' : ''}`}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            <span className={labelClass}>Déconnexion</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
