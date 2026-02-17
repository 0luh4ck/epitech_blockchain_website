import React from 'react';
import BlockchainToast from './BlockchainToast';

const BlockchainToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <BlockchainToast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
};

export default BlockchainToastContainer;
