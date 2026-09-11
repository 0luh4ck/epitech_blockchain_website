import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, BookOpen, FileText, KeyRound, ClipboardCheck, CalendarDays, Code2, HelpCircle, Mail } from 'lucide-react';
import { ROUTES } from '../utils/constants';
import ClubLogo from '../components/ClubLogo';

const API_DOCS_URL =
  `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '')}/docs`;

const SECTIONS = [
  {
    id: 'presentation',
    title: 'Présentation du club',
    icon: BookOpen,
    keywords: 'club blockchain epitech benin web3 mission',
    body: (
      <>
        <p>
          Le <strong>Club Blockchain d'Epitech Bénin</strong>, né de la collaboration entre
          Epitech Bénin, Future Studio et l'Africa Blockchain Institute, explore la
          décentralisation et le Web3 : séminaires, ateliers pratiques, conférences et
          examens de validation des acquis.
        </p>
        <p>
          Cette plateforme centralise l'adhésion, les activités, les QCM d'évaluation et
          le suivi des membres. La documentation technique de l'API est exposée sur{' '}
          <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Swagger UI (/api/docs)</a>.
        </p>
      </>
    ),
  },
  {
    id: 'adhesion',
    title: "Processus d'adhésion",
    icon: FileText,
    keywords: 'adhesion inscription demande approbation bureau validation',
    body: (
      <ol className="list-decimal pl-5 space-y-2">
        <li>Déposez une demande via <Link to={ROUTES.MEMBERSHIP_REQUEST} className="text-blue-600 font-bold hover:underline">la page d'adhésion</Link> (email, identité, motivation).</li>
        <li>Votre dossier passe au statut <em>en attente</em> : il est examiné par le Bureau Exécutif.</li>
        <li>Après approbation, vous recevez vos accès par email et pouvez vous connecter à l'espace Membre.</li>
        <li>En cas de rejet, le motif est communiqué et une nouvelle candidature reste possible.</li>
      </ol>
    ),
  },
  {
    id: 'connexion',
    title: 'Connexion : choisir son espace',
    icon: KeyRound,
    keywords: 'connexion login espace membre bureau mot de passe',
    body: (
      <>
        <p>
          La page <Link to={ROUTES.LOGIN} className="text-blue-600 font-bold hover:underline">/login</Link> propose
          deux onglets : <strong>Membre</strong> et <strong>Membre du Bureau</strong>. L'espace choisi doit
          correspondre à votre rôle enregistré, sinon la connexion est refusée.
        </p>
        <p>
          Premier accès : le mot de passe initial doit être remplacé immédiatement via la modale dédiée.
          L'accès d'administration vit sur une route confidentielle, non liée publiquement.
        </p>
      </>
    ),
  },
  {
    id: 'examens',
    title: 'Examens & QCM : règles',
    icon: ClipboardCheck,
    keywords: 'examen qcm test score tentatives durée passage',
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Chaque examen définit une <strong>durée</strong>, un <strong>score de passage</strong> et un <strong>nombre de tentatives</strong> limité.</li>
        <li>Démarrez via <em>start</em>, répondez à toutes les questions, puis <em>submit</em> : la correction est automatique.</li>
        <li>Une tentative commencée et non soumise dans les temps peut être comptabilisée : ne fermez pas la page en cours d'épreuve.</li>
        <li>Les résultats sont consultables après soumission ; le Bureau peut suivre les scores.</li>
      </ul>
    ),
  },
  {
    id: 'activites',
    title: 'Activités & présences',
    icon: CalendarDays,
    keywords: 'activites evenements inscription presence atelier seminaire',
    body: (
      <p>
        Parcourez les <Link to={ROUTES.ACTIVITIES} className="text-blue-600 font-bold hover:underline">activités</Link> (séminaires,
        ateliers, conférences), inscrivez-vous en un clic et présentez-vous le jour J : le Bureau marque
        les présences, visibles dans votre tableau de bord.
      </p>
    ),
  },
  {
    id: 'api',
    title: 'API & Swagger',
    icon: Code2,
    keywords: 'api swagger openapi jwt token documentation technique',
    body: (
      <>
        <p>
          L'API REST est documentée en OpenAPI 3.0 et explorable via Swagger UI :{' '}
          <a href={API_DOCS_URL} target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">{API_DOCS_URL}</a>.
        </p>
        <p>
          Authentification par <strong>JWT Bearer</strong> (<code>Authorization: Bearer &lt;token&gt;</code>),
          obtenu sur <code>POST /api/auth/login</code>. Codes couverts : 200, 201, 400, 401, 403, 404, 500.
        </p>
      </>
    ),
  },
  {
    id: 'faq',
    title: 'FAQ',
    icon: HelpCircle,
    keywords: 'faq aide probleme acces perdu compte desactive',
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Accès perdu ?</strong> Écrivez à contact@epitech-blockchain.bj depuis votre adresse Epitech.</li>
        <li><strong>Compte désactivé ?</strong> Seul le Bureau peut le réactiver après vérification.</li>
        <li><strong>Mauvais espace ?</strong> Le message d'erreur indique l'espace attendu : changez d'onglet sur /login.</li>
      </ul>
    ),
  },
  {
    id: 'contact',
    title: 'Contact',
    icon: Mail,
    keywords: 'contact email aide support',
    body: (
      <p>
        Une question ? <Link to={ROUTES.CONTACT} className="text-blue-600 font-bold hover:underline">Contactez-nous</Link> ou
        écrivez à <a href="mailto:contact@epitech-blockchain.bj" className="text-blue-600 font-bold hover:underline">contact@epitech-blockchain.bj</a>.
      </p>
    ),
  },
];

const Docs = () => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(() => new Set(['presentation']));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SECTIONS;
    return SECTIONS.filter(
      (s) => `${s.title} ${s.keywords}`.toLowerCase().includes(q)
    );
  }, [query]);

  const toggle = (id) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <ClubLogo className="h-16 w-auto object-contain mx-auto mb-4" />
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Documentation</h1>
        <p className="text-slate-500 font-medium mt-2">Guides d'utilisation de la plateforme du Club Blockchain Epitech Bénin</p>
        <div className="relative max-w-xl mx-auto mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (adhésion, QCM, connexion, API…)"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8 items-start">
        {/* Sommaire interactif */}
        <nav className="hidden lg:block sticky top-24 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 px-2">Sommaire</p>
          <ul className="space-y-1">
            {filtered.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen((prev) => new Set(prev).add(s.id))}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                  <s.icon className="h-4 w-4 shrink-0" />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
          {filtered.length === 0 && (
            <p className="text-sm text-slate-400 px-2">Aucune section trouvée.</p>
          )}
        </nav>

        {/* Sections pliables */}
        <div className="space-y-4">
          {filtered.map((s) => {
            const isOpen = open.has(s.id);
            return (
              <section
                key={s.id}
                id={s.id}
                className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden scroll-mt-28"
              >
                <button
                  onClick={() => toggle(s.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center gap-3 px-6 py-5 text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="flex-1 text-lg font-black text-slate-900">{s.title}</span>
                  <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-600 leading-relaxed space-y-3 border-t border-slate-50 pt-4">
                    {s.body}
                  </div>
                )}
              </section>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 font-medium">
              Aucun résultat pour « {query} ». Essayez un autre mot-clé.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Docs;
