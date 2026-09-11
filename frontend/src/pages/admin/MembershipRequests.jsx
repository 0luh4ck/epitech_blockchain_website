import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  Calendar,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { membershipRequestsService } from '../../services/membershipRequests';
import { MEMBERSHIP_STATUS } from '../../utils/constants';
import { useToast } from '../../context/ToastContext';
import Skeleton from '../../components/Skeleton';

const MembershipRequests = () => {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null); // approve/reject en cours (spinner + anti double-clic)
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    loadRequests();
    loadStats();
  }, [filter, pagination.page]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await membershipRequestsService.getRequests(params);
      setRequests(response.data.requests);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await membershipRequestsService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    }
  };

  const handleApprove = async (id) => {
    if (actingId) return;
    setActingId(id);
    try {
      await membershipRequestsService.approveRequest(id);
      toast.success('Demande approuvée, compte membre créé.');
      loadRequests();
      loadStats();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error(error.response?.data?.message || 'Échec de l\'approbation. Veuillez réessayer.');
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id, reason) => {
    if (actingId) return;
    setActingId(id);
    try {
      await membershipRequestsService.rejectRequest(id, { rejection_reason: reason });
      toast.success('Demande rejetée.');
      loadRequests();
      loadStats();
      setSelectedRequest(null);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error(error.response?.data?.message || 'Échec du rejet. Veuillez réessayer.');
    } finally {
      setActingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      [MEMBERSHIP_STATUS.PENDING]: {
        icon: Clock,
        color: 'bg-amber-500/10 text-amber-300 border border-amber-500/30',
        text: 'En attente'
      },
      [MEMBERSHIP_STATUS.APPROVED]: {
        icon: CheckCircle,
        color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30',
        text: 'Approuvée'
      },
      [MEMBERSHIP_STATUS.REJECTED]: {
        icon: XCircle,
        color: 'bg-red-500/10 text-red-300 border border-red-500/30',
        text: 'Rejetée'
      }
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    );
  };

  const filteredRequests = requests.filter(request => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.first_name.toLowerCase().includes(searchLower) ||
        request.last_name.toLowerCase().includes(searchLower) ||
        request.email.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl text-slate-100 p-6">
        <h1 className="fluid-h2 font-black text-slate-100 mb-4 tracking-tight">
          Gestion des Demandes d'Adhésion
        </h1>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-slate-700/60 rounded-xl">
                <Clock className="h-6 w-6 text-slate-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">En attente</p>
                <p className="text-2xl font-bold text-slate-100">
                  {stats.byStatus?.find(s => s.status === 'pending')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-slate-700/60 rounded-xl">
                <CheckCircle className="h-6 w-6 text-slate-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Approuvées</p>
                <p className="text-2xl font-bold text-slate-100">
                  {stats.byStatus?.find(s => s.status === 'approved')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-slate-700/60 rounded-xl">
                <XCircle className="h-6 w-6 text-slate-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Rejetées</p>
                <p className="text-2xl font-bold text-slate-100">
                  {stats.byStatus?.find(s => s.status === 'rejected')?.count || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700/50 p-4 rounded-2xl">
            <div className="flex items-center">
              <div className="p-2 bg-slate-700/60 rounded-xl">
                <User className="h-6 w-6 text-slate-300" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total</p>
                <p className="text-2xl font-bold text-slate-100">{stats.total || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Rechercher une demande"
                className="pl-10 pr-4 py-2 min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none w-full transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Filtrer par statut"
              className="min-h-[44px] bg-slate-800 border border-slate-700 rounded-xl text-slate-200 px-3 py-2 focus:border-red-500 focus:ring-4 focus:ring-red-500/20 outline-none transition-all"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des demandes */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl text-slate-100">
        {loading ? (
          <div className="p-6">
            <Skeleton dark variant="table" rows={5} columns={4} />
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-medium">
            Aucune demande ne correspond aux critères.
          </div>
        ) : (
          <>
          {/* Cartes mobiles (< 768px) : pas de défilement horizontal */}
          <div className="md:hidden divide-y divide-slate-800">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="text-slate-200 font-medium text-sm">
                      {request.first_name[0]}{request.last_name[0]}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-100 truncate">
                      {request.first_name} {request.last_name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{request.email}</p>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    aria-label="Voir le détail"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-lg border border-slate-700 text-sm font-bold text-slate-200 active:bg-slate-800 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    <Eye className="h-4 w-4" /> Détails
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={actingId === request.id}
                        aria-label="Approuver"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-lg bg-emerald-600 text-sm font-bold text-white disabled:opacity-60 active:bg-emerald-700 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                      >
                        {actingId === request.id
                          ? <><span className="btn-spinner" aria-hidden="true" />…</>
                          : <><CheckCircle className="h-4 w-4" /> Approuver</>}
                      </button>
                      <button
                        onClick={() => handleReject(request.id, 'Rejeté par l\'administrateur')}
                        disabled={actingId === request.id}
                        aria-label="Rejeter"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3 rounded-lg border border-red-500/40 text-sm font-bold text-red-300 disabled:opacity-60 active:bg-red-500/10 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        {actingId === request.id
                          ? <><span className="btn-spinner" aria-hidden="true" />…</>
                          : <><XCircle className="h-4 w-4" /> Rejeter</>}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Tableau desktop */}
          <div className="overflow-x-auto hidden md:block">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-800/80 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Candidat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-slate-900/60 divide-y divide-slate-800/60 text-slate-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-800/60 hover:bg-slate-800/60 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-slate-700 flex items-center justify-center">
                            <span className="text-slate-200 font-medium text-sm">
                              {request.first_name[0]}{request.last_name[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-100">
                            {request.first_name} {request.last_name}
                          </div>
                          {request.student_id && (
                            <div className="text-sm text-slate-400">
                              ID: {request.student_id}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-100">{request.email}</div>
                      {request.phone && (
                        <div className="text-sm text-slate-400">{request.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(request.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        aria-label="Voir le détail"
                        title="Voir le détail"
                        className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-300 hover:text-white hover:-translate-y-0.5 active:translate-y-0 mr-1 transition-all focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={actingId === request.id}
                            aria-label="Approuver la demande"
                            title="Approuver"
                            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-emerald-400 hover:text-emerald-300 hover:-translate-y-0.5 active:translate-y-0 mr-1 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400 rounded-lg"
                          >
                            {actingId === request.id
                              ? <span className="btn-spinner" aria-hidden="true" />
                              : <CheckCircle className="h-5 w-5" />}
                          </button>
                          <button
                            onClick={() => handleReject(request.id, 'Rejeté par l\'administrateur')}
                            disabled={actingId === request.id}
                            aria-label="Rejeter la demande"
                            title="Rejeter"
                            className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-red-400 hover:text-red-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-red-400 rounded-lg"
                          >
                            {actingId === request.id
                              ? <span className="btn-spinner" aria-hidden="true" />
                              : <XCircle className="h-5 w-5" />}
                          </button>
                        </>
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
        <div className="bg-slate-900/90 px-4 py-3 flex items-center justify-between border-t border-slate-800 rounded-b-2xl sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="relative inline-flex items-center px-4 py-2 min-h-[44px] border border-slate-700 text-sm font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Précédent
            </button>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 min-h-[44px] border border-slate-700 text-sm font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
            >
              Suivant
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">
                Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> à{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                sur <span className="font-medium">{pagination.total}</span> résultats
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`relative inline-flex items-center px-4 py-2 min-h-[44px] border text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-red-400 ${
                      page === pagination.page
                        ? 'z-10 bg-red-500/15 border-red-500/40 text-red-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Modal de détail */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/70 overflow-y-auto h-full w-full z-50 p-3">
          <div className="relative top-10 md:top-20 mx-auto p-5 border border-slate-700 w-full sm:w-11/12 md:w-3/4 lg:w-1/2 max-h-[85vh] overflow-y-auto shadow-xl rounded-2xl bg-slate-900 text-slate-100">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-100">
                  Détails de la demande
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  aria-label="Fermer le détail"
                  className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] text-slate-500 hover:text-slate-200 rounded-lg transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Prénom</label>
                    <p className="mt-1 text-sm text-slate-100">{selectedRequest.first_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Nom</label>
                    <p className="mt-1 text-sm text-slate-100">{selectedRequest.last_name}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400">Email</label>
                  <p className="mt-1 text-sm text-slate-100">{selectedRequest.email}</p>
                </div>
                
                {selectedRequest.phone && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Téléphone</label>
                    <p className="mt-1 text-sm text-slate-100">{selectedRequest.phone}</p>
                  </div>
                )}
                
                {selectedRequest.student_id && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400">ID Étudiant</label>
                    <p className="mt-1 text-sm text-slate-100">{selectedRequest.student_id}</p>
                  </div>
                )}
                
                {selectedRequest.motivation && (
                  <div>
                    <label className="block text-sm font-medium text-slate-400">Motivation</label>
                    <p className="mt-1 text-sm text-slate-100">{selectedRequest.motivation}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-slate-400">Statut</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400">Date de soumission</label>
                  <p className="mt-1 text-sm text-slate-100">
                    {new Date(selectedRequest.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
              
              {selectedRequest.status === 'pending' && (
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                  <button
                    onClick={() => handleReject(selectedRequest.id, 'Rejeté par l\'administrateur')}
                    disabled={actingId === selectedRequest.id}
                    className="min-h-[44px] px-4 py-2 border border-red-500/40 rounded-xl text-sm font-bold text-red-300 hover:bg-red-500/10 active:bg-red-500/20 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleApprove(selectedRequest.id)}
                    disabled={actingId === selectedRequest.id}
                    className="min-h-[44px] px-4 py-2 bg-emerald-600 border border-transparent rounded-xl text-sm font-bold text-white hover:bg-emerald-500 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 transition-all focus-visible:ring-2 focus-visible:ring-emerald-400"
                  >
                    {actingId === selectedRequest.id ? (
                      <><span className="btn-spinner" aria-hidden="true" /> Traitement…</>
                    ) : 'Approuver'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipRequests;
