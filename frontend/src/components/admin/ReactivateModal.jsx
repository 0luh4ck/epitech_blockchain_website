import React, { useState } from 'react';
import { X, Undo2, Copy, Check } from 'lucide-react';
import { usersService } from '../../services/users';
import { useToast } from '../../context/ToastContext';

const inputClass =
  'w-full px-4 py-3 min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all';
const labelClass =
  'block text-xs font-black text-slate-400 uppercase tracking-widest mb-2';

/**
 * Modale de réactivation d'un compte anonymisé (Admin).
 * Réassigne une identité valide + nouveau mot de passe temporaire.
 */
const ReactivateModal = ({ user, onClose, onReactivated }) => {
  const toast = useToast();
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null); // { user, tempPassword }
  const [copied, setCopied] = useState(false);

  const set = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.email.trim()) {
      setError('Un email valide doit être réassigné au compte.');
      return;
    }

    setLoading(true);
    try {
      const res = await usersService.reactivateUser(user.id, form);
      setResult(res.data);
      toast.success('Compte réactivé avec succès.');
      onReactivated?.();
    } catch (err) {
      const data = err.response?.data || {};
      const details = Array.isArray(data.errors) ? ` Détails : ${data.errors.join(' ; ')}` : '';
      const msg = `${data.message || data.error || 'Échec de la réactivation.'}${details}`;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(result.tempPassword);
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
      aria-label="Réactiver un compte anonymisé"
    >
      <div
        className="w-full max-w-lg bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 rounded-xl">
              <Undo2 className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">Réactiver le compte</h2>
              <p className="text-xs text-slate-500">ID #{user?.id} — identité archivée à remplacer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-500 hover:text-slate-200 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {result ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Compte réactivé pour{' '}
              <span className="font-bold text-slate-200">{result.user.email}</span>.
              Transmettez ce mot de passe temporaire :
            </p>
            <div className="flex items-center gap-2 p-4 bg-slate-800 border border-slate-700 rounded-xl">
              <code className="flex-1 font-mono text-base font-bold text-amber-300 break-all">
                {result.tempPassword}
              </code>
              <button
                onClick={copyPassword}
                aria-label="Copier le mot de passe"
                className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400"
              >
                {copied ? <Check className="h-5 w-5 text-emerald-400" /> : <Copy className="h-5 w-5" />}
              </button>
            </div>
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
            <div>
              <label className={labelClass} htmlFor="ra-email">Nouvel email *</label>
              <input
                id="ra-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="membre@epitech.eu"
                disabled={loading}
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass} htmlFor="ra-firstName">Prénom</label>
                <input
                  id="ra-firstName"
                  type="text"
                  value={form.firstName}
                  onChange={set('firstName')}
                  placeholder="Ada"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="ra-lastName">Nom</label>
                <input
                  id="ra-lastName"
                  type="text"
                  value={form.lastName}
                  onChange={set('lastName')}
                  placeholder="Lovelace"
                  disabled={loading}
                  className={inputClass}
                />
              </div>
            </div>
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
                className="min-h-[44px] px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
              >
                {loading ? (
                  <><span className="btn-spinner" aria-hidden="true" /> Réactivation…</>
                ) : 'Réactiver le compte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReactivateModal;
