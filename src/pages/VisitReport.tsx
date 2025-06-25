import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VisitReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const merchant = location.state || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-8 px-2 sm:px-4" dir="rtl">
      <h2 className="text-2xl font-semibold text-gray-900 text-center my-8">تسجيل تفاصيل الزيارة</h2>
      <div className="bg-white shadow-md w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المنشأة</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-gray-100 text-gray-500 font-normal"
              value={merchant.tradeName || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهوية أو السجل التجاري</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-gray-100 text-gray-500 font-normal"
              value={merchant.idOrCR || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الرخصه</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-gray-100 text-gray-500 font-normal"
              value={merchant.license || ''}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-gray-100 text-gray-500 font-normal"
              value={merchant.phone || ''}
              readOnly
            />
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-[#163A59] mb-2">التاريخ</label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-[#1C8C81] focus:border-[#1C8C81] text-gray-500 font-normal"
              value={new Date().toISOString().split('T')[0]}
              readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#163A59] mb-2">الوقت <span className="text-xs text-gray-400">(يُسجل تلقائياً)</span></label>
            <input
              type="time"
              className="w-full px-3 py-2 border border-[#1C8C81] rounded-lg bg-[#F2F2F2] focus:outline-none focus:ring-2 focus:ring-[#1C8C81] focus:border-[#1C8C81] text-gray-500 font-normal"
              value={new Date().toTimeString().slice(0, 5)}
              readOnly
            />
          </div>
          <div className="pt-4">
            <button
              type="button"
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200"
              onClick={() => navigate('/packages')}
            >
              متابعة تفاصيل الاشتراك
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitReport;
