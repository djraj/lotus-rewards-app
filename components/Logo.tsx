import React from 'react';

// Single source of truth for the brand mark. Assets live in public/:
//   /logo.png      — lotus + "Golden Lotus Healing Center" lockup (app surfaces)
//   /logo-mark.png — lotus only (favicon, tight spaces)
type LogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ variant = 'full', className }) => (
  <img
    src={variant === 'mark' ? '/logo-mark.png' : '/logo.png'}
    alt="GLHC Rewards"
    className={className}
  />
);

export default Logo;
