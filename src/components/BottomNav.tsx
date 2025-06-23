
import React from 'react';
import './BottomNav.css';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  return (
    <div className="bottom-nav">
      <div className="d-flex justify-content-around">
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
        >
          <div><i className="fas fa-home"></i></div>
          <div>الرئيسية</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'merchants' ? 'active' : ''}`}
          onClick={() => onNavigate('merchants')}
        >
          <div><i className="fas fa-users"></i></div>
          <div>التجار</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'visitReport' ? 'active' : ''}`}
          onClick={() => onNavigate('visitReport')}
        >
          <div><i className="fas fa-plus-circle"></i></div>
          <div>زيارة جديدة</div>
        </a>
        <a href="#" className="nav-item">
          <div><i className="fas fa-map-marked-alt"></i></div>
          <div>الخريطة</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'packages' ? 'active' : ''}`}
          onClick={() => onNavigate('packages')}
        >
          <div><i className="fas fa-user-circle"></i></div>
          <div>الملف الشخصي</div>
        </a>
      </div>
    </div>
  );
};

export default BottomNav;
