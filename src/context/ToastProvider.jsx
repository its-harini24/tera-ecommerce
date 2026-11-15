import { useState, useCallback } from 'react';
import { ToastContext } from './ToastContext';

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * showToast(message, type)
   * type: 'success' | 'error' | 'info' | 'warning'  (default: 'info')
   */
  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

/* Internal container rendered at root level */
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

const ICONS = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

const ToastItem = ({ toast, onRemove }) => {
  const { id, message, type } = toast;

  return (
    <div className={`toast toast--${type}`} role="alert">
      <span className="toast__icon">{ICONS[type] ?? ICONS.info}</span>
      <span className="toast__message">{message}</span>
      <button
        className="toast__close"
        onClick={() => onRemove(id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
};

export default ToastProvider;
