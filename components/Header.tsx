
import React from 'react';
import { DemoView } from '../types';

interface HeaderProps {
  activeView: DemoView;
}

const Header: React.FC<HeaderProps> = ({ activeView }) => {
  return (
    <header className="bg-base-200/50 backdrop-blur-sm shadow-md border-b border-base-300/50 p-4 z-10">
      <h1 className="text-2xl font-bold text-white tracking-tight">{activeView}</h1>
    </header>
  );
};

export default Header;
