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
    primary: 'text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    outline: 'border border-primary-500/50 text-primary-400 hover:bg-primary-500/10 hover:border-primary-500',
    ghost: 'text-primary-400 hover:bg-primary-500/10',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
    xl: 'px-9 py-4 text-lg',
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
        relative overflow-hidden rounded-xl font-semibold font-heading
        transition-all duration-300 transform
        active:scale-95 focus:outline-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      style={isPrimary ? {
        background: 'linear-gradient(135deg, #00d2ff, #7000ff)',
        boxShadow: 'none',
      } : {}}
      onMouseEnter={isPrimary ? (e) => {
        e.currentTarget.style.boxShadow = '0 0 25px rgba(0, 210, 255, 0.5), 0 0 50px rgba(112, 0, 255, 0.25)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      } : undefined}
      onMouseLeave={isPrimary ? (e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
      onClick={handleClick}
      disabled={disabled}
      {...props}
    >
      {/* Shimmer overlay for primary */}
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700 skew-x-12" />
      )}

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
