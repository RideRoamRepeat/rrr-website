import React from 'react';

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  className = '',
  children,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-950';

  const styles =
    variant === 'primary'
      ? 'bg-emerald-400 text-zinc-950 hover:bg-emerald-300 focus:ring-emerald-300'
      : variant === 'secondary'
        ? 'bg-white/10 text-white hover:bg-white/15 focus:ring-white/30'
        : 'bg-transparent text-white/80 hover:text-white focus:ring-white/30';

  return (
    <Component className={`${base} ${styles} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
