
import React from 'react';

const IbmIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 20H9v4H7v-4H4v-2h7zm2-6h5v2h-5z"/>
        <path d="M30 14V6H0v20h15v-2H2V8h26v6zm-2 6h-5v-2h-2v8h2v-4h5v4h2v-8h-2z"/>
    </svg>
);
export default IbmIcon;
