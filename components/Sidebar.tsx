
import React from 'react';
import { DemoView } from '../types';
import RocketIcon from './icons/RocketIcon';
import CalendarIcon from './icons/CalendarIcon';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import BeakerIcon from './icons/BeakerIcon';

interface SidebarProps {
  activeView: DemoView;
  setActiveView: (view: DemoView) => void;
}

const NavItem: React.FC<{
  view: DemoView;
  activeView: DemoView;
  setActiveView: (view: DemoView) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, activeView, setActiveView, icon, label }) => {
  const isActive = activeView === view;
  return (
    <li>
      <button
        onClick={() => setActiveView(view)}
        className={`flex items-center p-3 my-1 w-full text-left rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-brand-primary text-white shadow-lg'
            : 'text-gray-300 hover:bg-base-300/50 hover:text-white'
        }`}
      >
        <span className="w-6 h-6 mr-3">{icon}</span>
        <span className="font-medium">{label}</span>
      </button>
    </li>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  return (
    <aside className="w-64 bg-base-200 text-white flex-shrink-0 p-4 border-r border-base-300/50 flex flex-col">
      <div className="flex items-center mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-accent rounded-full flex items-center justify-center mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold tracking-wider">HOSTING-Q</h1>
      </div>

      <nav className="flex-1">
        <ul className="space-y-1">
          <NavItem
            view={DemoView.Portfolio}
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<BeakerIcon className="w-6 h-6" />}
            label="HOSTING-Q"
          />
          <NavItem
            view={DemoView.Scheduling}
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<CalendarIcon />}
            label="Scheduling"
          />
          <NavItem
            view={DemoView.Risk}
            activeView={activeView}
            setActiveView={setActiveView}
            icon={<ShieldCheckIcon />}
            label="Risk Analysis"
          />
        </ul>
      </nav>

      <div className="mt-auto text-center text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} HOSTING-Q Simulations</p>
      </div>
    </aside>
  );
};

export default Sidebar;
