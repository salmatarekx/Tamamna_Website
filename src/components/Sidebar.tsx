import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHome, FaMapMarkedAlt, FaUsers, FaSignOutAlt, FaRegQuestionCircle } from 'react-icons/fa';

const navItems = [
  { label: 'الرئيسية', icon: <FaHome />, path: '/dashboard' },
  { label: 'الملف الشخصي', icon: <FaUser />, path: '/profile' },
  { label: 'الخريطة', icon: <FaMapMarkedAlt />, path: '/map' },
  { label: 'التجار', icon: <FaUsers />, path: '/merchants' },
  { label: 'الدعم و المساعده', icon: <FaRegQuestionCircle />, path: '/dashboard#support' },
];

const Sidebar: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      {/* Sidebar */}
      <div className="relative bg-white w-72 max-w-full h-full shadow-xl flex flex-col">
        {/* User Info */}
        <div className="flex flex-col items-center py-6">
          <div className="w-16 h-16 rounded-full bg-[#24BFA3] flex items-center justify-center mb-2">
            <FaUser className="text-3xl text-white" />
          </div>
          <div className="font-bold text-lg text-[#153959]">اسم المستخدم</div>
          <div className="text-[#24BFA3] text-sm">user@email.com</div>
        </div>
        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map(item => (
              <li key={item.label}>
                <button
                  className="flex items-center gap-3 w-full text-[#153959] text-base font-bold py-2 px-2 rounded transition-colors hover:bg-[#24BFA3] hover:text-white focus:bg-[#24BFA3] focus:text-white"
                  onClick={() => {
                    if (item.label === 'الدعم و المساعده') {
                      navigate('/dashboard');
                      setTimeout(() => {
                        const el = document.getElementById('support');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 300);
                      onClose();
                    } else {
                      navigate(item.path);
                      onClose();
                    }
                  }}
                >
                  <span className="text-xl" style={{ color: '#153959' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {/* Sign out */}
        <div className="px-4 py-4">
          <button
            className="flex items-center gap-2 text-[#153959] hover:text-[#24BFA3] text-base font-medium"
            onClick={() => { /* Add sign out logic here */ onClose(); }}
          >
            <FaSignOutAlt className="text-lg" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
        {/* Close button for mobile */}
        <button
          className="absolute top-4 left-4 text-[#24BFA3] hover:text-[#153959] text-2xl focus:outline-none"
          onClick={onClose}
          aria-label="إغلاق القائمة"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 