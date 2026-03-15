import React from 'react';

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  required?: boolean;
}

export function FormField({ label, children, fullWidth, required }: FormFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', gridColumn: fullWidth ? '1 / -1' : undefined }}>
      <label style={{ fontSize: '11.5px', fontWeight: 600, color: '#4A5568', textTransform: 'uppercase', letterSpacing: '0.7px' }}>
        {label}{required && <span style={{ color: '#FF453A', marginLeft: '2px' }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export const inputStyle: React.CSSProperties = {
  padding: '10px 13px',
  borderRadius: '8px',
  border: '1.5px solid #DDE3EE',
  background: '#F5F7FA',
  fontSize: '13.5px',
  fontFamily: "'Inter', sans-serif",
  color: '#0D1B2A',
  outline: 'none',
  transition: 'all 0.2s ease',
  width: '100%',
  boxSizing: 'border-box',
};

export const selectStyle: React.CSSProperties = {
  ...inputStyle,
  cursor: 'pointer',
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
export function Input(props: InputProps) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = '#0A84FF'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.1)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#DDE3EE'; e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.boxShadow = 'none'; }}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}
export function Select({ children, ...props }: SelectProps) {
  return (
    <select
      {...props}
      style={{ ...selectStyle, ...props.style }}
      onFocus={e => { e.currentTarget.style.borderColor = '#0A84FF'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(10,132,255,0.1)'; }}
      onBlur={e => { e.currentTarget.style.borderColor = '#DDE3EE'; e.currentTarget.style.background = '#F5F7FA'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      {children}
    </select>
  );
}
