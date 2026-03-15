import React from 'react';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral' | 'purple';

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  success: { background: 'rgba(48,209,88,0.12)', color: '#20A040' },
  warning: { background: 'rgba(255,214,10,0.18)', color: '#A07800' },
  danger: { background: 'rgba(255,69,58,0.12)', color: '#C0392B' },
  info: { background: 'rgba(10,132,255,0.1)', color: '#0A84FF' },
  neutral: { background: '#F0F3F8', color: '#4A5568' },
  purple: { background: 'rgba(139,92,246,0.1)', color: '#7C3AED' },
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span style={{
      ...variantStyles[variant],
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 10px', borderRadius: '20px',
      fontSize: '11.5px', fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    ativo: { variant: 'success', label: 'Ativo' },
    inativo: { variant: 'neutral', label: 'Inativo' },
    pendente: { variant: 'warning', label: 'Pendente' },
    confirmado: { variant: 'info', label: 'Confirmado' },
    em_transito: { variant: 'purple', label: 'Em Trânsito' },
    entregue: { variant: 'success', label: 'Entregue' },
    cancelado: { variant: 'danger', label: 'Cancelado' },
  };
  const cfg = map[status] || { variant: 'neutral' as BadgeVariant, label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
