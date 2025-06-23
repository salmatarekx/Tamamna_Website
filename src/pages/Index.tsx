
import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Merchants from './Merchants';
import MerchantDetail from './MerchantDetail';
import VisitReport from './VisitReport';
import Packages from './Packages';
import BottomNav from '../components/BottomNav';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('login');

  const handleLogin = () => {
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  return (
    <div className="min-h-screen bg-light" dir="rtl">
      {currentScreen === 'login' && <Login onLogin={handleLogin} />}
      {currentScreen !== 'login' && (
        <>
          {currentScreen === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
          {currentScreen === 'merchants' && <Merchants onNavigate={handleNavigate} />}
          {currentScreen === 'merchantDetail' && <MerchantDetail onNavigate={handleNavigate} />}
          {currentScreen === 'visitReport' && <VisitReport onNavigate={handleNavigate} />}
          {currentScreen === 'packages' && <Packages />}
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default Index;
