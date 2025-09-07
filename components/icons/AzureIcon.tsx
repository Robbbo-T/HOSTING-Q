import React from 'react';

const AzureIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
      <path d="M8 36l14-24h10L18 36z" />
      <path d="M28 18h12l-14 24H14z" opacity=".6"/>
    </svg>
);

export default AzureIcon;