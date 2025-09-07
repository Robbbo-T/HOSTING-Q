
import React from 'react';

const DwaveIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50,0A50,50,0,1,0,99.5,60.55,50,50,0,0,0,50,0Zm0,92.56A42.56,42.56,0,1,1,92.56,50,42.61,42.61,0,0,1,50,92.56Z"/>
      <path d="M50,21.57A28.43,28.43,0,1,0,78.43,50,28.46,28.46,0,0,0,50,21.57Zm0,49.42A21,21,0,1,1,71,50,21,21,0,0,1,50,71Z"/>
      <circle cx="50" cy="50" r="13.52"/>
    </svg>
);

export default DwaveIcon;
