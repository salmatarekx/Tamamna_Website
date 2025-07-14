import React, { useState } from 'react';
import Screenshot from '../assets/Screenshot 2025-06-25 022750.png';
import Sidebar from './Sidebar';
import GoldLogo from '../assets/Goldlogo2.jpeg';

const TopBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 py-2 shadow-sm fixed top-0 left-0 right-0 z-40 bg-brand-white" style={{ minHeight: '56px' }}>
        <button
          className="p-2 text-brand-black hover:text-gold-dark focus:outline-none"
          aria-label="القائمة"
          style={{ zIndex: 10 }}
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="11" width="24" height="2" rx="1" fill="currentColor" />
            <rect y="17" width="24" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        <img src={GoldLogo} alt="Gold Station Logo" className="h-24 w-auto" />
      </header>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  );
};

export default TopBar; 