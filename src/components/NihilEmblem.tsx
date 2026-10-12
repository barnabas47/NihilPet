import React from 'react';

export const NihilEmblem: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="eggGrad" x1="12" y1="8" x2="52" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9d4edd" />
          <stop offset="50%" stopColor="#3a0ca3" />
          <stop offset="100%" stopColor="#00f2fe" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <path
        d="M32 6C20 6 12 18 12 34C12 48 20 58 32 58C44 58 52 48 52 34C52 18 44 6 32 6Z"
        fill="url(#eggGrad)"
        stroke="#00f2fe"
        strokeWidth="2"
        filter="url(#glow)"
      />
      <rect x="22" y="20" width="20" height="18" rx="3" fill="#8bac0f" stroke="#0f380f" strokeWidth="1.5" />
      {/* 8-bit Nihil pet face */}
      <rect x="26" y="25" width="3" height="3" fill="#0f380f" />
      <rect x="35" y="25" width="3" height="3" fill="#0f380f" />
      <rect x="29" y="32" width="6" height="2" fill="#0f380f" />
      <circle cx="25" cy="45" r="2.5" fill="#f72585" />
      <circle cx="32" cy="48" r="2.5" fill="#00f2fe" />
      <circle cx="39" cy="45" r="2.5" fill="#f72585" />
    </svg>
  );
};

