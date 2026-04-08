import React, { useState, useRef } from 'react';

const BlockchainButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  const [ripples, setRipples] = useState([]);
  const buttonRef = useRef(null);

  const variants = {
    primary: 'text-white border-transparent',
    secondary: 'bg-white border-slate-200 text-slate-700 hover:border-blue-300 hover:text-blue-600 shadow-sm',
    outline: 'border border-blue-600/50 text-blue-600 hover:bg-blue-50',
    ghost: 'text-blue-600 hover:bg-blue-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
    xl: 'px-10 py-5 text-lg',
  };

  const handleClick = (e) => {
    if (disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();
    setRipples(prev => [...prev, { x, y, size, id }]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    if (onClick) onClick(e);
  };

  const isPrimary = variant === 'primary';

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`
        relative overflow-hidden rounded-2xl font-bold font-heading
        transition-all duration-300 transform
        active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        border
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #3b82f6, #10b981)',
        boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)',
      } : {}}
      onMouseEnter={isPrimary ? (e) => {
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.45), 0 0 40px rgba(16, 185, 129, 0.2)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={isPrimary ? (e) => {
        e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.39)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
            animationDuration: '600ms',
          }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default BlockchainButton;
