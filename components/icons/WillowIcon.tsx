import React from 'react';

const WillowIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg 
        className={className} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M12 22V12M12 12L8 8M12 12L16 8M8 8L5 5M8 8L11 5M16 8L13 5M16 8L19 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 12L8 16M12 12L16 16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default WillowIcon;