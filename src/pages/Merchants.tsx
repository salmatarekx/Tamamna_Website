import React, { useState, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel
} from '../components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../lib/utils';

interface MerchantProps {
  onNavigate: (screen: string) => void;
}

const renderStars = (ratingValue: number) => {
  return [1, 2, 3, 4, 5].map(star => (
    <span
      key={star}
      className={`text-lg ${star <= ratingValue ? 'text-gold' : 'text-gold-light'}`}
    >
      ⭐
    </span>
  ));
};

const Merchants: React.FC<MerchantProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    fetch(`${API_URL}/api/vendors`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setVendors(data.data || []);
      })
      .catch(err => {
        console.error('Error fetching vendors:', err);
      });
  }, []);

  const handleSearch = () => {
    alert(`بحث عن: ${search}`);
  };

  // Filter merchants based on search and category
  const filteredMerchants = vendors.filter(merchant => {
    if (!search) return true;
    const value = merchant[searchCategory] || '';
    return value.includes(search);
  });

  return (
    <div className="p-4 max-w-4xl mx-auto relative" dir="rtl">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mt-8">
        <div className="relative w-full sm:w-2/3 flex flex-col gap-2 justify-center mx-auto">
          <div className="relative">
          <input 
            type="text" 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full min-w-[180px] px-8 py-3 pr-12 border border-gold rounded-full focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
            placeholder="ابحث..."
              aria-label="بحث"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gold-dark hover:text-gold focus:outline-none"
            aria-label="بحث"
          >
            🔍
          </button>
          </div>
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={`w-full px-8 py-3 border border-gold rounded-full text-brand-green text-right focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent appearance-none flex items-center justify-between`}
                  style={{ backgroundColor: '#B7F2F5' }}
                  aria-label="اختر نوع البحث"
                  type="button"
                >
                  {searchCategory === '' ? 'اختر طريقة البحث' :
                    searchCategory === 'name' ? 'اسم التاجر' :
                    searchCategory === 'phone' ? 'رقم الجوال' :
                    searchCategory === 'idOrCR' ? 'رقم السجل التجاري' : ''}
                  <svg className="ml-2 w-4 h-4 text-gold-dark" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="center" 
                className="w-full min-w-[180px] max-w-[320px] sm:max-w-[320px] sm:w-auto sm:mx-0 mx-2 left-0 right-0 sm:left-auto sm:right-auto rounded-xl shadow-lg border border-gray-200 bg-white p-2 z-50"
                style={{ boxSizing: 'border-box' }}
              >
                <DropdownMenuLabel>اختر طريقة البحث</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setSearchCategory('name')}>اسم التاجر</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSearchCategory('phone')}>رقم الجوال</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setSearchCategory('idOrCR')}>رقم السجل التجاري</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <button
          className="flex items-center gap-2 bg-gold text-brand-white px-4 py-2 rounded-full shadow hover:bg-gold-dark transition-colors duration-200 text-base font-bold mt-2 sm:mt-0"
          onClick={() => navigate('/add-merchant')}
          type="button"
        >
          <span className="text-xl">➕</span> إضافة تاجر جديد
        </button>
      </div>
      <div className="space-y-3">
        {vendors.map(merchant => (
          <div 
            key={merchant.id} 
            className="bg-brand-white p-4 rounded-lg shadow-sm border border-brand-green cursor-pointer transition-shadow duration-200 hover:bg-gold-light hover:text-brand-green hover:shadow-lg"
            onClick={() => navigate(`/merchant/${merchant.id}`)}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h6 className="font-semibold text-brand-green mb-2">{merchant.commercial_name || merchant.name}</h6>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-gold">📞</span>
                  <span className="text-gold font-bold">{merchant.mobile}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="mr-2 text-blue-600">📍</span>
                  <span className="text-gray-700">{merchant.city}</span>
                </div>
                {merchant.rating !== undefined && merchant.rating !== null && (
                  <div className="flex items-center">
                    <span className="mr-2 text-gold-dark">⭐ {merchant.rating}</span>
                  </div>
                )}
              </div>
              <div className="text-gold-light">
                <span className="text-lg">›</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Merchants;

