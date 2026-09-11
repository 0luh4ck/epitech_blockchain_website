import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/admin/AdminLayout';
import { ROUTES, SUPERADMIN_LOGIN_PATH, LEGACY_SUPERADMIN_HONEYPOTS } from './utils/constants';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MembershipRequest from './pages/auth/MembershipRequest';

import MustChangePasswordModal from './components/MustChangePasswordModal';

// Lazy loading pour les autres pages
import { lazy, Suspense } from 'react';

const About = lazy(() => import('./pages/About'));
const ExecutiveBoard = lazy(() => import('./pages/ExecutiveBoard'));
const Partners = lazy(() => import('./pages/Partners'));
const Activities = lazy(() => import('./pages/Activities'));
const Membership = lazy(() => import('./pages/Membership'));
const Contact = lazy(() => import('./pages/Contact'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const Admin = lazy(() => import('./pages/Admin'));
// Formulaire Superadmin en lazy : la route obscurcie n'alourdit pas le bundle
// principal et son chunk reste dissocié des pages publiques.
const AdminLogin = lazy(() => import('./pages/auth/AdminLogin'));
const MembershipRequests = lazy(() => import('./pages/admin/MembershipRequests'));
const MembersManagement = lazy(() => import('./pages/admin/MembersManagement'));
const ExamImmersive = lazy(() => import('./pages/ExamImmersive'));
const ExamResult = lazy(() => import('./pages/ExamResult'));
const ActivityEditor = lazy(() => import('./pages/admin/ActivityEditor'));
const Docs = lazy(() => import('./pages/Docs'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="relative">
      <div className="animate-spin rounded-full h-16 w-16 border-2 border-transparent border-t-blue-600 border-r-green-500"></div>
      <div className="absolute inset-0 rounded-full animate-ping opacity-10 border-2 border-blue-500"></div>
    </div>
  </div>
);

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

// Composant pour les routes admin (admin + executive du Bureau)
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.role === 'superadmin' || user.role === 'executive';
  return isAdmin ? children : <Navigate to={ROUTES.DASHBOARD} replace />;
};

// Séparation hermétique des layouts :
// - Layout (public : Navbar + Footer) = routes publiques et espace membre UNIQUEMENT.
// - AdminLayout (privé : Sidebar slate-950, ni Navbar ni Footer) = /admin/*,
//   route superadmin et /profile pour les rôles privilégiés.
const PRIVILEGED_ROLES = ['admin', 'superadmin', 'executive'];
const getStoredRole = () => {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}').role;
  } catch {
    return undefined;
  }
};

// /profile : layout admin (Sidebar) si admin/bureau, layout public sinon
const ProfileRoute = ({ children }) => (
  <ProtectedRoute>
    {PRIVILEGED_ROLES.includes(getStoredRole()) ? (
      <AdminRoute>
        <AdminLayout>{children}</AdminLayout>
      </AdminRoute>
    ) : (
      <Layout>{children}</Layout>
    )}
  </ProtectedRoute>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  {/* Routes publiques */}
                  <Route path={ROUTES.HOME} element={<Layout><Home /></Layout>} />
                  <Route path={ROUTES.ABOUT} element={<Layout><About /></Layout>} />
                  <Route path={ROUTES.EXECUTIVE_BOARD} element={<Layout><ExecutiveBoard /></Layout>} />
                  <Route path={ROUTES.PARTNERS} element={<Layout><Partners /></Layout>} />
                  <Route path={ROUTES.ACTIVITIES} element={<Layout><Activities /></Layout>} />
                  <Route path={ROUTES.MEMBERSHIP} element={<Layout><Membership /></Layout>} />
                  <Route path={ROUTES.CONTACT} element={<Layout><Contact /></Layout>} />
                  <Route path={ROUTES.DOCS} element={<Layout><Docs /></Layout>} />

                  {/* Routes d'authentification */}
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  {/* Connexion Superadmin : écran TOTALEMENT isolé — ni Layout
                      public (Navbar/Footer), ni AdminLayout (Sidebar). La Sidebar
                      n'est rendue que dans l'espace authentifié ci-dessous. */}
                  <Route path={SUPERADMIN_LOGIN_PATH} element={<AdminLogin />} />
                  {/* Honeypots : anciens chemins devinables -> 404, jamais de login */}
                  {LEGACY_SUPERADMIN_HONEYPOTS.map((honeypot) => (
                    <Route key={honeypot} path={honeypot} element={<NotFound />} />
                  ))}
                  <Route path={ROUTES.REGISTER} element={<Register />} />
                  <Route path={ROUTES.MEMBERSHIP_REQUEST} element={<MembershipRequest />} />

                  {/* Routes protégées */}
                  <Route
                    path={ROUTES.DASHBOARD}
                    element={
                      <ProtectedRoute>
                        <Layout><Dashboard /></Layout>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path={ROUTES.PROFILE}
                    element={
                      <ProfileRoute>
                        <Profile />
                      </ProfileRoute>
                    }
                  />
                  {/* Espace admin STRICTEMENT isolé : AdminLayout (Sidebar),
                      jamais le Layout public (ni Navbar ni Footer) */}
                  <Route
                    path={ROUTES.ADMIN}
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <AdminLayout><Admin /></AdminLayout>
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/membership-requests"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <AdminLayout><MembershipRequests /></AdminLayout>
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/activity-editor"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <AdminLayout><ActivityEditor /></AdminLayout>
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin/members"
                    element={
                      <ProtectedRoute>
                        <AdminRoute>
                          <AdminLayout><MembersManagement /></AdminLayout>
                        </AdminRoute>
                      </ProtectedRoute>
                    }
                  />

                  {/* Mode Examen & Résultats */}
                  <Route
                    path="/exams/:id/take"
                    element={
                      <ProtectedRoute>
                        <ExamImmersive />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/exams/:id/result"
                    element={
                      <ProtectedRoute>
                        <Layout><ExamResult /></Layout>
                      </ProtectedRoute>
                    }
                  />

                  {/* Route 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>

              {/* Modale Bloquante Must Change Password (Exclusivité Superadmin) */}
              <MustChangePasswordModal />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
