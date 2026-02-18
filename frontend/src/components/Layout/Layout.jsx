import React from 'react';
import { Toaster } from 'react-hot-toast';
import BlockchainNav from '../BlockchainNav';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <BlockchainNav />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(17, 17, 24, 0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            color: '#f0f0ff',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(0, 210, 255, 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#00d2ff',
              secondary: '#050505',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#f87171',
              secondary: '#050505',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
