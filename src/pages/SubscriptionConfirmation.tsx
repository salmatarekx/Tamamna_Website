import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionConfirmation: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] px-4">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-6 flex flex-col items-center bg-white rounded-xl shadow-lg">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-6">
          <circle cx="50" cy="50" r="45" stroke="#0CA1A2" strokeWidth="6" fill="none" />
          <path d="M32 54l14 12 22-28" stroke="#0CA1A2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <h2 className="text-2xl font-bold text-[#0C2240] text-center mb-2">تم تفعيل إشتراكك بنجاح و انهاء الزيارة</h2>

        <p className="text-[#0C2240] text-center text-base mb-6">شكراً لاستخدامك خدمتنا.</p>
        <button
          className="w-full bg-[#0CA1A2] text-white py-3 rounded-xl text-base sm:text-lg font-bold hover:bg-[#0FA697] transition-colors duration-200"
          onClick={() => navigate('/dashboard')}
        >
          العودة إلى الصفحة الرئيسية
        </button>
      </div>
    </div>
  );
};

export default SubscriptionConfirmation; 