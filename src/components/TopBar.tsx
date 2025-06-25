import React, { useState } from 'react';
import Screenshot from '../assets/Screenshot 2025-06-25 022750.png';
import Sidebar from './Sidebar';

const TopBar: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="w-full flex items-center justify-between px-4 py-2 shadow-sm fixed top-0 left-0 right-0 z-40" style={{ minHeight: '56px', backgroundColor: '#24BFA3' }}>
        <button
          className="p-2 text-white hover:text-teal-200 focus:outline-none"
          aria-label="القائمة"
          style={{ zIndex: 10 }}
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
            <rect y="5" width="24" height="2" rx="1" fill="white" />
            <rect y="11" width="24" height="2" rx="1" fill="white" />
            <rect y="17" width="24" height="2" rx="1" fill="white" />
          </svg>
        </button>
        <img src={Screenshot} alt="TMMNA Logo" className="h-16 w-auto" />
      </header>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  );
};

export default TopBar; 