import React from 'react';

export const IconCartridge: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M2 1h12v14H2V1zm2 2v3h8V3H4zm0 5v5h8V8H4z" fillRule="evenodd" />
  </svg>
);

export const IconBattery: React.FC<{ level?: number; className?: string }> = ({ level = 85, className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M1 4h12v8H1V4zm13 2h2v4h-2V6zM3 6h7v4H3V6z" fillRule="evenodd" />
  </svg>
);

export const IconSkinTag: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M2 3l6-2 6 2v10l-6 2-6-2V3zm3 3v4h6V6H5z" fillRule="evenodd" />
  </svg>
);

export const IconOscilloscope: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M1 8h3l2-5 3 10 2-7 2 2h2v2h-1l-2-2-2 7-3-10-2 5H1V8z" />
  </svg>
);

export const IconFeed: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M1 2l14 6-14 6V2zm3 3v6l8-3-8-3z" />
  </svg>
);

export const IconPoke: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M6 1h4v7h2v3l-4 4-4-4V8h2V1z" />
  </svg>
);

export const IconVoid: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M4 4a4 4 0 013.6 2.2L12 12a4 4 0 000-8L7.6 9.8A4 4 0 014 4zm8 8a4 4 0 01-3.6-2.2L4 4a4 4 0 000 8l4.4-5.8A4 4 0 0112 12z" />
  </svg>
);

export const IconShock: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M9 1L3 9h5l-2 6 8-9H9l1-5z" />
  </svg>
);

export const IconTrophy: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className}>
    <path d="M3 2h10v3c0 2.2-1.8 4-4 4H7C4.8 9 3 7.2 3 5V2zm-2 1h2v3H1V3zm12 0h2v3h-2V3zm-6 8h2v2H7v-2zm-2 2h6v1H5v-1z" />
  </svg>
);
