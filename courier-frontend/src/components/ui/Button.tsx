import React from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:   'bg-green-600 hover:bg-green-700 text-white border-transparent',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300',
  danger:    'bg-red-600 hover:bg-red-700 text-white border-transparent',
  ghost:     'bg-transparent hover:bg-gray-100 text-gray-600 border-transparent',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2 text-sm',
};

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => (
  <button
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 font-medium border
      rounded-full cursor-pointer transition-colors duration-150
      disabled:opacity-60 disabled:cursor-not-allowed
      ${variantClasses[variant]} ${sizeClasses[size]} ${className}
    `}
    {...props}
  >
    {loading && <span className={`spinner ${variant === 'primary' || variant === 'danger' ? '' : 'spinner-green'}`} />}
    {children}
  </button>
);

export default Button;
