import React from 'react';

export function NavOverviewIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.85" />
      <rect x="13" y="3" width="8" height="5" rx="2" fill="currentColor" opacity="0.45" />
      <rect x="13" y="10" width="8" height="11" rx="2" fill="currentColor" opacity="0.65" />
      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function NavShelfIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="14" width="16" height="3" rx="1" fill="currentColor" opacity="0.35" />
      <rect x="5" y="5" width="4" height="9" rx="1" fill="currentColor" opacity="0.7" />
      <rect x="10" y="4" width="4" height="10" rx="1" fill="currentColor" opacity="0.85" />
      <rect x="15" y="6" width="4" height="8" rx="1" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function NavLabsIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 3 H15 V8 L19 18 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 18 L9 8 Z" fill="currentColor" opacity="0.25" />
      <path d="M9 3 H15 V8 L19 18 A2 2 0 0 1 17 21 H7 A2 2 0 0 1 5 18 L9 8 Z" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
      <path d="M8 14 H16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.6" />
      <circle cx="12" cy="17" r="1.5" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function NavActivityIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="6" cy="16" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="12" cy="10" r="2.5" fill="currentColor" opacity="0.7" />
      <circle cx="18" cy="6" r="3" fill="currentColor" opacity="0.95" />
      <path d="M6 16 L12 10 L18 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

export function NavNotebookMarkIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="3" width="14" height="18" rx="2" fill="currentColor" opacity="0.2" />
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
      <path d="M9 3 V21" stroke="currentColor" strokeWidth="1.75" opacity="0.5" />
      <path d="M13 8 H16 M13 12 H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
