import React from 'react';

// Single source of truth for the brand mark. Assets live in public/:
//   /logo.svg      — lotus + "Golden Lotus Healing Center" lockup (app surfaces)
//   /logo-mark.svg — lotus only (favicon, tight spaces)
type LogoProps = {
  variant?: 'full' | 'mark';
  className?: string;
};

const Logo: React.FC<LogoProps> = ({ variant = 'full', className }) => (
  <img
    src={variant === 'mark' ? '/logo-mark.svg' : '/logo.svg'}
    alt="GLHC Rewards"
    className={className}
  />
);

export default Logo;
