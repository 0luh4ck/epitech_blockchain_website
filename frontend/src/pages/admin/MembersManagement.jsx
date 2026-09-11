import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  UserPlus,
  Download,
  Trash2,
  ArrowUpCircle,
  Power,
  RotateCcw,
} from 'lucide-react';
import { usersService } from '../../services/users';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import Skeleton from '../../components/Skeleton';
import CreateUserModal from '../../components/admin/CreateUserModal';
import ReactivateModal from '../../components/admin/ReactivateModal';

const ROLE_OPTIONS = [
  { value: 'member', label: 'Membre' },
  { value: 'executive', label: 'Bureau' },
  { value: 'admin', label: 'Admin' },
];

const roleBadge = (role) => {
  if (role === 'admin' || role === 'superadmin') {
    return 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs';
  }
  if (role === 'executive') {
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs';
  }
  return 'bg-slate-700/60 text-slate-300 border border-slate-700 rounded-full px-3 py-1 text-xs';
};

const statusOf = (user) => {
  if (!user.isActive) return 'disabled';
  if (!user.isVerified) return 'pending';
  return 'active';
};

const statusBadge = (status) => {
  if (status === 'active') {
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs';
  }
  if (status === 'pending') {
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs';
  }
  return 'bg-red-500/10 text-red-400 border border-red-500/20 rounded-full px-3 py-1 text-xs';
};

const statusLabel = (status) =>
  status === 'active'
    ? 'Actif'
    : status === 'pending'
      ? 'En attente'
      : status === 'archived'
        ? 'Archivé'
        : 'Désactivé';

const archivedBadge =
  'bg-slate-700/60 text-slate-300 border border-slate-700 rounded-full px-3 py-1 text-xs';

/**
 * Gestion opérationnelle des comptes membres (Admin/Bureau).
 * Recherche serveur + filtres, actions directes, export CSV, création manuelle.
 */
const MembersManagement = () => {
  const toast = useToast();
  const { user: currentUser } = useAuth();
  // RBAC : le Bureau (executive) est en lecture seule — écritures réservées
  // à admin/superadmin (le backend requireAdminOnly les rejette aussi en 403).
  const canWrite =
    currentUser?.role === 'admin' || currentUser?.role === 'superadmin';
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 15, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [reactivateTarget, setReactivateTarget] = useState(null);

  // Recherche avec debounce (évite une requête par frappe)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: pagination.page, limit: pagination.limit };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;
      // Les archivés sont exclus par défaut côté API ; le toggle les réinclut
      if (showArchived) params.includeAnonymized = 'true';
      const res = await usersService.getUsers(params);
      setUsers(res.data.users || []);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error('Erreur chargement membres:', error);
      toast.error(error.response?.data?.message || 'Échec du chargement des membres.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, roleFilter, search, showArchived]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Un compte archivé (anonymisé) n'apparaît que si le toggle est actif.
  // L'API les exclut déjà par défaut : double protection côté UI.
  const isArchived = (u) =>
    !!u.isAnonymized || String(u.email || '').endsWith('@deleted.local');

  const effectiveStatus = (u) => (isArchived(u) ? 'archived' : statusOf(u));

  const filtered = users.filter((u) => {
    if (!showArchived && isArchived(u)) return false;
    if (statusFilter === 'all') return true;
    return effectiveStatus(u) === statusFilter;
  });

  const mutate = async (id, fn, successMsg) => {
    if (actingId) return;
    setActingId(id);
    try {
      await fn();
      toast.success(successMsg);
      loadUsers();
    } catch (error) {
      // Erreur de validation centralisée : message + tableau errors éventuel
      const data = error.response?.data || {};
      const details = Array.isArray(data.errors) ? ` Détails : ${data.errors.join(' ; ')}` : '';
      toast.error(`${data.message || "Échec de l'opération."}${details}`);
    } finally {
      setActingId(null);
    }
  };

  const handleRoleChange = (id, role) =>
    mutate(id, () => usersService.updateUser(id, { role }), 'Rôle mis à jour.');

  const handlePromote = (id) =>
    mutate(id, () => usersService.updateUser(id, { role: 'executive' }), 'Membre promu dans le Bureau.');

  const handleToggleActive = (user) =>
    mutate(
      user.id,
      () => usersService.updateUser(user.id, { isActive: !user.isActive }),
      user.isActive ? 'Compte désactivé.' : 'Compte réactivé.'
    );

  // Suppression = anonymisation (soft delete) : aucune ligne n'est effacée.
  // Le compte disparaît des listes/stats et peut être réactivé ensuite.
  const handleDelete = (user) => {
    if (!window.confirm(`Anonymiser ${user.firstName} ${user.lastName} (${user.email}) ? Le compte sera archivé (soft delete) et pourra être réactivé.`)) return;
    mutate(user.id, () => usersService.deleteUser(user.id), 'Compte anonymisé (soft delete).');
  };

  const handleExportCsv = async () => {
    try {
      toast.info('Préparation de l’export CSV…');
      const params = { page: 1, limit: 1000 };
      if (roleFilter !== 'all') params.role = roleFilter;
      if (search) params.search = search;
      const res = await usersService.getUsers(params);
      const rows = (res.data.users || []).filter(
        (u) =>
          (showArchived || !isArchived(u)) &&
          (statusFilter === 'all' ? true : effectiveStatus(u) === statusFilter)
      );
      const header = ['id', 'email', 'firstName', 'lastName', 'phone', 'studentId', 'role', 'position', 'isActive', 'isVerified', 'lastLogin', 'createdAt'];
      const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const csv = [header.join(';'), ...rows.map((u) =>
        [u.id, u.email, u.firstName, u.lastName, u.phone, u.studentId, u.role, u.position, u.isActive, u.isVerified, u.lastLogin, u.createdAt].map(escape).join(';')
      )].join('\n');
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `membres-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`${rows.length} membre(s) exporté(s).`);
    } catch (error) {
      toast.error("Échec de l'export CSV.");
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête + actions */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h1 className="fluid-h2 font-black text-slate-100 tracking-tight">
              Gestion des Membres
            </h1>
            <p className="text-slate-400 mt-1">
              {pagination.total} compte(s) — recherche, rôles, statuts et actions directes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/50 font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Download className="h-4 w-4" /> Exporter (CSV)
            </button>
            {canWrite ? (
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-red-950/40 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <UserPlus className="h-4 w-4" /> Créer un membre
              </button>
            ) : (
              <span className="inline-flex items-center min-h-[44px] px-5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 font-bold text-sm">
                Lecture seule (Bureau)
              </span>
            )}
          </div>
        </div>

        {/* Recherche + filtres */}
        <div className="flex flex-col lg:flex-row gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label="Rechercher un membre"
              className="pl-10 pr-4 py-2.5 min-h-[44px] w-full bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPagination((p) => ({ ...p, page: 1 })); }}
            aria-label="Filtrer par rôle"
            className="min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 px-3 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
          >
            <option value="all">Tous les rôles</option>
            <option value="executive">Bureau</option>
            <option value="member">Membre</option>
            <option value="admin">Admin</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtrer par statut"
            className="min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 px-3 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="pending">En attente</option>
            <option value="disabled">Désactivé</option>
            <option value="archived">Archivé</option>
          </select>
          <button
            onClick={() => setShowArchived((v) => !v)}
            aria-pressed={showArchived}
            title="Inclure les comptes anonymisés (réactivation possible)"
            className={`inline-flex items-center justify-center min-h-[44px] px-4 rounded-xl border font-bold text-sm transition-all focus-visible:ring-2 focus-visible:ring-red-400 ${
              showArchived
                ? 'bg-red-500/15 border-red-500/40 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {showArchived ? 'Masquer les archivés' : 'Afficher les archivés'}
          </button>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-slate-900/70 backdrop-blur-md border border-slate-800/80 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-6">
            <Skeleton dark variant="table" rows={6} columns={4} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">
            Aucun membre ne correspond aux critères.
          </div>
        ) : (
          <>
            {/* Cartes mobiles */}
            <div className="md:hidden divide-y divide-slate-800/60">
              {filtered.map((u) => (
                <div key={u.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                      <span className="text-slate-200 font-bold text-sm">
                        {u.firstName?.[0]}{u.lastName?.[0]}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-100 truncate">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`${roleBadge(u.role)} font-bold`}>{u.role}</span>
                    {isArchived(u) ? (
                      <span className={`${archivedBadge} font-bold`}>Archivé</span>
                    ) : (
                      <span className={`${statusBadge(statusOf(u))} font-bold`}>{statusLabel(statusOf(u))}</span>
                    )}
                  </div>
                  {canWrite && (
                  <div className="flex flex-wrap gap-2">
                    {isArchived(u) ? (
                      <button
                        onClick={() => setReactivateTarget(u)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-emerald-600 text-sm font-bold text-white hover:bg-emerald-500 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        <RotateCcw className="h-4 w-4" /> Réactiver
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handlePromote(u.id)}
                          disabled={actingId === u.id || u.role === 'executive'}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-slate-800 text-sm font-bold text-slate-200 border border-slate-700/50 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <ArrowUpCircle className="h-4 w-4" /> Bureau
                        </button>
                        <button
                          onClick={() => handleToggleActive(u)}
                          disabled={actingId === u.id}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-xl bg-slate-800 text-sm font-bold text-slate-200 border border-slate-700/50 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Power className="h-4 w-4" /> {u.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={actingId === u.id}
                          aria-label="Anonymiser le compte (soft delete)"
                          title="Anonymiser (soft delete)"
                          className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] rounded-xl border border-red-500/40 text-red-300 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                  )}
                </div>
              ))}
            </div>

            {/* Tableau desktop */}
            <div className="overflow-x-auto hidden md:block">
              <table className="min-w-full divide-y divide-slate-800/60">
                <thead className="bg-slate-800/80 border-b border-slate-800">
                  <tr>
                    {['Membre', 'Rôle', 'Statut', 'Dernière connexion', 'Actions'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-slate-400 tracking-wider uppercase">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-slate-900/60 divide-y divide-slate-800/60 text-slate-200">
                  {filtered.map((u) => (
                    <tr key={u.id} className="border-b border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-slate-100">{u.firstName} {u.lastName}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canWrite ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value)}
                            disabled={actingId === u.id}
                            aria-label={`Rôle de ${u.email}`}
                            className="min-h-[40px] bg-slate-800 border border-slate-700 rounded-lg text-slate-200 text-sm px-2 focus:border-red-500 outline-none disabled:opacity-50"
                          >
                            {ROLE_OPTIONS.map((r) => (
                              <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`${roleBadge(u.role)} font-bold`}>{u.role}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {isArchived(u) ? (
                          <span className={`${archivedBadge} font-bold`}>Archivé</span>
                        ) : (
                          <span className={`${statusBadge(statusOf(u))} font-bold`}>{statusLabel(statusOf(u))}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleString('fr-FR') : 'Jamais'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {canWrite && (
                        <div className="flex items-center gap-1">
                          {isArchived(u) ? (
                            <button
                              onClick={() => setReactivateTarget(u)}
                              title="Réactiver le compte"
                              aria-label={`Réactiver le compte ${u.id}`}
                              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 text-emerald-400 hover:text-emerald-300 text-sm font-bold rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                              <RotateCcw className="h-5 w-5" /> Réactiver
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handlePromote(u.id)}
                                disabled={actingId === u.id || u.role === 'executive'}
                                title="Promouvoir dans le Bureau"
                                aria-label={`Promouvoir ${u.email}`}
                                className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-300 hover:text-white rounded-lg disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                              >
                                {actingId === u.id ? <span className="btn-spinner" aria-hidden="true" /> : <ArrowUpCircle className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleToggleActive(u)}
                                disabled={actingId === u.id}
                                title={u.isActive ? 'Désactiver' : 'Réactiver'}
                                aria-label={`${u.isActive ? 'Désactiver' : 'Réactiver'} ${u.email}`}
                                className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-slate-300 hover:text-white rounded-lg disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                              >
                                <Power className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(u)}
                                disabled={actingId === u.id}
                                title="Anonymiser (soft delete)"
                                aria-label={`Anonymiser ${u.email}`}
                                className="inline-flex items-center justify-center min-w-[40px] min-h-[40px] text-red-400 hover:text-red-300 rounded-lg disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl px-4 py-3 flex items-center justify-between text-sm text-slate-400">
          <p>
            Page <span className="font-bold text-slate-200">{pagination.page}</span> sur{' '}
            <span className="font-bold text-slate-200">{pagination.pages}</span> — {pagination.total} membre(s)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page === 1}
              className="min-h-[44px] px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold disabled:opacity-50 hover:bg-slate-700 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Précédent
            </button>
            <button
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="min-h-[44px] px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-bold disabled:opacity-50 hover:bg-slate-700 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {canWrite && showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={loadUsers}
        />
      )}

      {canWrite && reactivateTarget && (
        <ReactivateModal
          user={reactivateTarget}
          onClose={() => setReactivateTarget(null)}
          onReactivated={loadUsers}
        />
      )}
    </div>
  );
};

export default MembersManagement;
