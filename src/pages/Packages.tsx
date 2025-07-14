import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletIcon from '@/assets/wallet1.png';
import ArrowIcon from '@/assets/arrow.png';
import SocialIcon from '@/assets/social.png';

const packages = [
  {
    id: 'free',
    name: 'الباقة المجانية',
    price: 'مجانا',
    description: 'عرض حتى 20 منتج فقط',
    badge: true,
  },
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    price: '1000 ريال / شهر',
  },
  {
    id: 'advanced',
    name: 'الباقة المتقدمة',
    price: '3000 ريال / شهر',
  },
  {
    id: 'premium',
    name: 'الباقة المميزة',
    price: '5000 ريال / شهر',
  },
];

const Packages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState('free');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-8 px-2 sm:px-4 relative">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="relative mb-6 flex flex-col items-center justify-center">
          <img src={WalletIcon} alt="Wallet Icon" className="w-56 h-44 object-contain mx-auto" />
        </div>
        <div className="flex flex-col items-center mb-4 mt-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#22314A] mb-1">إتمام التسجيل والدفع</h2>
          <p className="text-[#22314A] text-xs sm:text-sm mb-4">اختر إحدى الباقات التالية للمتابعة.</p>
        </div>
        <div className="flex flex-col gap-3 sm:gap-4 mb-6">
          {packages.map(pkg => (
            <div
              key={pkg.id}
              className={`p-4 sm:p-5 cursor-pointer transition-all border ${
                selectedPackage === pkg.id
                  ? 'border-gold bg-[#E6FAF8] shadow-md'
                  : 'border-gold bg-brand-white hover:border-gold-dark'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-lg font-bold text-[#22314A]">{pkg.name}</span>
                {pkg.badge && (
                  <span className="bg-gold text-brand-white text-xs font-bold rounded px-3 py-1">{pkg.price}</span>
                )}
              </div>
              {pkg.badge ? (
                <div className="text-[#22314A] text-sm">{pkg.description}</div>
              ) : (
                <div className="text-[#22314A] text-base font-medium">{pkg.price}</div>
              )}
            </div>
          ))}
        </div>
        <button
          className="w-full bg-gold text-brand-black py-3 rounded-xl text-base sm:text-lg font-bold hover:bg-gold-dark hover:text-brand-white transition-colors duration-200"
          disabled={!selectedPackage}
          onClick={() => navigate('/verification-code')}
        >
          الإشتراك
        </button>
      </div>
    </div>
  );
};

export default Packages;
