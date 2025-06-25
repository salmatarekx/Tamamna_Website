import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Merchants from './Merchants';
import MerchantDetail from './MerchantDetail';
import VisitReport from './VisitReport';
import Packages from './Packages';
import BottomNav from '../components/BottomNav';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userName, setUserName] = useState('');

  const handleLogin = (name: string) => {
    setUserName(name);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen);
  };

  useEffect(() => {
    const handler = () => setCurrentScreen('dashboard');
    window.addEventListener('navigate-dashboard', handler);
    return () => window.removeEventListener('navigate-dashboard', handler);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {currentScreen === 'login' && <Login onLogin={handleLogin} />}
      {currentScreen !== 'login' && (
        <>
          <div className="pb-20">
            {currentScreen === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
            {currentScreen === 'merchants' && <Merchants onNavigate={handleNavigate} />}
            {currentScreen === 'merchantDetail' && <MerchantDetail onNavigate={handleNavigate} />}
            {currentScreen === 'visitReport' && <VisitReport onNavigate={handleNavigate} userName={userName} />}
            {currentScreen === 'packages' && <Packages />}
          </div>
          <BottomNav currentScreen={currentScreen} onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
};

export default Index;
