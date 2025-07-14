import React, { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface MerchantDetailProps {
  onNavigate: (screen: string) => void;
}

const activityOptions = [
  { value: 'تجارة التجزئة', label: 'تجارة التجزئة' },
  { value: 'تجارة الجملة', label: 'تجارة الجملة' },
  { value: 'خدمات', label: 'خدمات' },
  { value: 'تصنيع', label: 'تصنيع' },
];

const MerchantDetail: React.FC<MerchantDetailProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0].value);
  const [merchant, setMerchant] = useState({
    tradeName: 'متجر الأنوار',
    idOrCR: '1234567890',
    license: 'RL-2024-001234',
    phone: '0501234567',
  });

  return (
    <div className="p-4 max-w-2xl mx-auto" dir="rtl">
      <div className="flex items-center mb-6">
        <button 
          className="p-2 mr-3 text-gold-dark hover:text-gold transition-colors duration-200"
          onClick={() => onNavigate('merchants')}
        >
          <span className="text-xl">←</span>
        </button>
        <h5 className="text-xl font-semibold text-brand-green">تفاصيل التاجر</h5>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">اسم المنشأة</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
            value={merchant.tradeName}
            onChange={e => setMerchant(m => ({ ...m, tradeName: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">رقم الهوية أو السجل التجاري</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
            value={merchant.idOrCR}
            onChange={e => setMerchant(m => ({ ...m, idOrCR: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">رقم الرخصه</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
            value={merchant.license}
            onChange={e => setMerchant(m => ({ ...m, license: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">رقم الهاتف</label>
          <input 
            type="tel" 
            className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
            value={merchant.phone}
            onChange={e => setMerchant(m => ({ ...m, phone: e.target.value }))}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">البريد الإلكتروني</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
            defaultValue="info@alanwar.com" 
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">العنوان</label>
          <div className="relative">
            <input 
              type="text" 
              className="w-full px-3 py-2 pr-10 border border-gold rounded-lg bg-gold-light text-gray-400 font-normal" 
              defaultValue="الرياض، المملكة العربية السعودية" 
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-dark">
              📍
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-brand-green mb-2">نوع النشاط التجاري</label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full px-3 py-2 border border-gold rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold appearance-none flex items-center justify-between bg-gold-light text-gray-400"
                type="button"
              >
                <span>{selectedActivity}</span>
                <svg className="ml-2 w-4 h-4 text-gold-dark" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="center" 
              className="w-full min-w-[180px] max-w-[320px] sm:max-w-[320px] sm:w-auto sm:mx-0 mx-2 left-0 right-0 sm:left-auto sm:right-auto rounded-xl shadow-lg border border-gold bg-gold-light p-2 z-50"
              style={{ boxSizing: 'border-box' }}
            >
              <DropdownMenuLabel>نوع النشاط التجاري</DropdownMenuLabel>
              {activityOptions.map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSelectedActivity(option.value)}
                  className={selectedActivity === option.value ? 'bg-gold text-brand-white' : ''}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-3 pt-4">
          <button 
            type="button" 
            className="w-full bg-gold text-brand-black py-3 px-4 rounded-lg hover:bg-gold-dark hover:text-brand-white transition-colors duration-200"
            onClick={() => navigate('/visitreport', { state: merchant })}
          >
            انشاء زياره
          </button>
          <button 
            type="button" 
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={() => navigate('/add-branch', { state: { vendor: { tradeName: merchant.tradeName, idOrCR: merchant.idOrCR } } })}
          >
            إضافة فرع جديد
          </button>
          <button 
            type="button" 
            className="w-full border border-gold text-brand-green py-3 px-4 rounded-lg hover:bg-gold-light transition-colors duration-200"
            onClick={() => onNavigate('merchants')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default MerchantDetail;
