import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ open, onClose, title, children, footer, maxWidth = 600 }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(10,25,50,0.45)',
        backdropFilter: 'blur(4px)',
        zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        width: '100%',
        maxWidth: `${maxWidth}px`,
        boxShadow: '0 16px 48px rgba(10,30,60,0.18)',
        maxHeight: '90vh',
        overflowY: 'auto',
        animation: 'slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <div style={{
          padding: '22px 28px 16px',
          borderBottom: '1px solid #DDE3EE',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, background: '#fff', zIndex: 1,
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#0D1B2A', margin: 0 }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: 'none', background: '#F0F3F8', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#4A5568', transition: 'background 0.2s',
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ padding: '24px 28px' }}>{children}</div>

        {footer && (
          <div style={{
            padding: '14px 28px 22px',
            display: 'flex', justifyContent: 'flex-end', gap: '10px',
            borderTop: '1px solid #DDE3EE',
          }}>
            {footer}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
      `}</style>
    </div>
  );
}

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
}

export function ConfirmModal({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', loading }: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={420}
      footer={
        <>
          <button onClick={onClose} style={btnOutlineStyle}>Cancelar</button>
          <button onClick={onConfirm} disabled={loading} style={btnDangerStyle}>
            {loading ? 'Aguarde…' : confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: '14px', color: '#4A5568', margin: 0, lineHeight: '1.6' }}>{message}</p>
    </Modal>
  );
}

const btnOutlineStyle: React.CSSProperties = {
  padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #DDE3EE',
  background: 'transparent', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600,
  color: '#4A5568', transition: 'background 0.2s', fontFamily: "'Inter', sans-serif",
};

const btnDangerStyle: React.CSSProperties = {
  padding: '9px 18px', borderRadius: '8px', border: 'none',
  background: 'rgba(255,69,58,0.12)', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600,
  color: '#C0392B', transition: 'background 0.2s', fontFamily: "'Inter', sans-serif",
};
