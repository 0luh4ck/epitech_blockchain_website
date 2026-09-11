import { useState, useCallback } from 'react';

const useBlockchainToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type, message, duration = 4000 }) => {
    const id = Date.now() + Math.random();
    const newToast = { id, type, message, duration };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => {
    return addToast({ type: 'success', message, duration });
  }, [addToast]);

  const error = useCallback((message, duration) => {
    return addToast({ type: 'error', message, duration });
  }, [addToast]);

  const warning = useCallback((message, duration) => {
    return addToast({ type: 'warning', message, duration });
  }, [addToast]);

  const info = useCallback((message, duration) => {
    return addToast({ type: 'info', message, duration });
  }, [addToast]);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Alias de compatibilité : showToast(message, type) utilisé par les modales
  const showToast = useCallback((message, type = 'info', duration) => {
    const valid = ['success', 'error', 'warning', 'info'].includes(type) ? type : 'info';
    return addToast({ type: valid, message, duration });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    showToast,
    clearAll
  };
};

export default useBlockchainToast;
