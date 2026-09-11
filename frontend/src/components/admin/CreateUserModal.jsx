import React, { useState } from 'react';
import { X, UserPlus, Copy, Check } from 'lucide-react';
import { usersService } from '../../services/users';
import { useToast } from '../../context/ToastContext';

const inputClass =
  'w-full px-4 py-3 min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all';
const labelClass =
  'block text-xs font-black text-slate-400 uppercase tracking-widest mb-2';

/**
 * Modale sombre de création manuelle d'un profil (Admin).
 * Retourne le mot de passe temporaire généré côté serveur.
 */
const CreateUserModal = ({ onClose, onCreated }) => {
  const toast = useToast();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'member',
    status: 'active',
    sendInvite: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null); // { user, tempPassword, inviteSent }
  const [copied, setCopied] = useState(false);

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim()) {
      setError('Nom, prénom et email sont requis.');
      return;
    }

    setLoading(true);
    try {
      const res = await usersService.createUser(form);
      setCreated(res.data);
      toast.success('Profil créé avec succès.');
      onCreated?.();
    } catch (err) {
      // Contrat exact envoyé : { firstName, lastName, email, role, status, sendInvite }
      // (rôles ENUM : member/executive/admin). Raison exacte affichée, jamais silencieuse.
      console.debug('[users] POST /users payload keys:', Object.keys(form));
      const data = err.response?.data || {};
      const details = Array.isArray(data.errors) ? ` Détails : ${data.errors.join(' ; ')}` : '';
      const msg = `${data.message || 'Échec de la création du profil.'}${details}`;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(created.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Copie impossible, sélectionnez le mot de passe manuellement.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Créer un profil membre"
    >
      <div
        className="w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-xl">
              <UserPlus className="h-5 w-5 text-red-400" />
            </div>
            <h2 className="text-lg font-black text-slate-100">Créer un profil</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-500 hover:text-slate-200 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {created ? (
          /* Écran de confirmation : mot de passe temporaire à transmettre */
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Compte créé pour{' '}
              <span className="font-bold text-slate-200">
                {created.user.firstName} {created.user.lastName}
              </span>{' '}
              ({created.user.email}). Transmettez-lui ce mot de passe temporaire
              (changement obligatoire à la première connexion) :
            </p>
            <div className="flex items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <code className="flex-1 font-mono text-base font-bold text-amber-300 break-all">
                {created.tempPassword}
              </code>
              <button
                onClick={copyPassword}
                aria-label="Copier le mot de passe"
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              {created.inviteSent
                ? 'Invitation envoyée par email.'
                : "Invitation email non envoyée (ou mode simulation SMTP)."}
            </p>
            <button
              onClick={onClose}
              className="w-full min-h-[44px] px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div role="alert" className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-bold text-red-300">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="cu-firstName">Prénom</label>
                <input
                  id="cu-firstName"
                  type="text"
                  value={form.firstName}
                  onChange={set('firstName')}
                  placeholder="Ada"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="cu-lastName">Nom</label>
                <input
                  id="cu-lastName"
                  type="text"
                  value={form.lastName}
                  onChange={set('lastName')}
                  placeholder="Lovelace"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="cu-email">Email</label>
              <input
                id="cu-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="nouveau@epitech.eu"
                disabled={loading}
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="cu-role">Rôle</label>
                <select id="cu-role" value={form.role} onChange={set('role')} disabled={loading} className={inputClass}>
                  <option value="member">Membre</option>
                  <option value="executive">Bureau</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="cu-status">Statut</label>
                <select id="cu-status" value={form.status} onChange={set('status')} disabled={loading} className={inputClass}>
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={form.sendInvite}
                onChange={set('sendInvite')}
                disabled={loading}
                className="h-5 w-5 rounded accent-red-500"
              />
              <span className="text-sm font-bold text-slate-300">
                Envoyer l'invitation par email (mot de passe temporaire inclus)
              </span>
            </label>

            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 font-bold text-sm disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
              >
                {loading ? (
                  <><span className="btn-spinner" aria-hidden="true" /> Création…</>
                ) : 'Créer le profil'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateUserModal;
