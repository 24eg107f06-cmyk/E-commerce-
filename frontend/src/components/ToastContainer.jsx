import React from 'react';
import { useToast } from '../context/ToastContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'error':
        return <AlertCircle size={18} color="#ef4444" />;
      case 'warning':
        return <AlertTriangle size={18} color="#f59e0b" />;
      default:
        return <Info size={18} color="#2563eb" />;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        maxWidth: 380,
        width: '100%',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: 'var(--surface, #ffffff)',
            borderRadius: '12px',
            padding: '14px 16px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            animation: 'slideUp 0.25s ease',
            fontSize: '0.9rem',
            color: '#0f172a',
          }}
        >
          <div style={{ flexShrink: 0 }}>{getIcon(toast.type)}</div>
          <div style={{ flex: 1, fontWeight: 500 }}>{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              color: '#94a3b8',
              padding: 4,
              borderRadius: 4,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
