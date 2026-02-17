import React, { createContext, useContext } from 'react';
import useBlockchainToast from '../hooks/useBlockchainToast';
import BlockchainToastContainer from '../components/BlockchainToastContainer';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const toast = useBlockchainToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <BlockchainToastContainer 
        toasts={toast.toasts} 
        onRemove={toast.removeToast} 
      />
    </ToastContext.Provider>
  );
};
