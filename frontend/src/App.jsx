import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout/Layout';
import { ROUTES } from './utils/constants';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MembershipRequest from './pages/auth/MembershipRequest';

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
const MembershipRequests = lazy(() => import('./pages/admin/MembershipRequests'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Composant de chargement
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
  </div>
);

// Composant pour les routes protégées
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

// Composant pour les routes admin
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin' || user.role === 'executive';
  return isAdmin ? children : <Navigate to={ROUTES.DASHBOARD} replace />;
};

function App() {
  return (
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
              
              {/* Routes d'authentification */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
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
                  <ProtectedRoute>
                    <Layout><Profile /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path={ROUTES.ADMIN} 
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <Layout><Admin /></Layout>
                    </AdminRoute>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/membership-requests" 
                element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <Layout><MembershipRequests /></Layout>
                    </AdminRoute>
                  </ProtectedRoute>
                } 
              />
              
              {/* Route 404 */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
