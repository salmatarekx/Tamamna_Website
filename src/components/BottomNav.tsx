import React from 'react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        <button 
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
            currentScreen === 'dashboard' 
              ? 'text-teal-600 bg-teal-50' 
              : 'text-gray-600 hover:text-teal-600'
          }`}
          onClick={() => onNavigate('dashboard')}
        >
          <div className="text-xl mb-1">🏠</div>
          <div className="text-xs">الرئيسية</div>
        </button>
        <button 
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
            currentScreen === 'merchants' 
              ? 'text-teal-600 bg-teal-50' 
              : 'text-gray-600 hover:text-teal-600'
          }`}
          onClick={() => onNavigate('merchants')}
        >
          <div className="text-xl mb-1">👥</div>
          <div className="text-xs">التجار</div>
        </button>
        <button 
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
            currentScreen === 'visitReport' 
              ? 'text-teal-600 bg-teal-50' 
              : 'text-gray-600 hover:text-teal-600'
          }`}
          onClick={() => onNavigate('visitReport')}
        >
          <div className="text-xl mb-1">➕</div>
          <div className="text-xs">زيارة جديدة</div>
        </button>
      
        <button 
          className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
            currentScreen === 'packages' 
              ? 'text-teal-600 bg-teal-50' 
              : 'text-gray-600 hover:text-teal-600'
          }`}
          onClick={() => onNavigate('packages')}
        >
          <div className="text-xl mb-1">👤</div>
          <div className="text-xs">الملف الشخصي</div>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
