import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastContainer from '../components/Toast/ToastContainer';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', title, message, duration = 4000, icon }) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [
      ...prev.slice(-4), // keep max 5 toasts visible
      { id, type, title, message, duration, icon },
    ]);
    return id;
  }, []);

  const toast = {
    success: (message, title = 'Success', opts = {}) => showToast({ type: 'success', title, message, ...opts }),
    error: (message, title = 'Error', opts = {}) => showToast({ type: 'error', title, message, ...opts }),
    info: (message, title = 'Notice', opts = {}) => showToast({ type: 'info', title, message, ...opts }),
    warning: (message, title = 'Warning', opts = {}) => showToast({ type: 'warning', title, message, ...opts }),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
