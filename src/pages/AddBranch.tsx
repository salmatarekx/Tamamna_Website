import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AddBranch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Expect vendor info to be passed via navigation state
  const vendor = location.state?.vendor || {};

  const [form, setForm] = useState({
    branchName: '',
    city: '',
    district: '',
    address: '',
    phone: '',
    map: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/merchants');
    }, 2000);
  };

  const inputClass = "w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal";
  const inputStyle = { backgroundColor: '#d6f1e9' };

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      {showSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-bold text-lg shadow">
          تم الحفظ بنجاح
        </div>
      )}
      <button
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
        onClick={() => navigate('/merchants')}
      >
        ← العودة إلى قائمة التجار
      </button>
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm animate-fade-in max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4 text-teal-700">إضافة فرع جديد</h3>
        {vendor && (
          <div className="mb-4 p-2 bg-gold-light rounded text-brand-green font-bold">
            التاجر: {vendor.tradeName || ''} {vendor.idOrCR ? `(رقم: ${vendor.idOrCR})` : ''}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم الفرع</label>
              <input name="branchName" value={form.branchName} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="اسم الفرع" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة</label>
              <input name="city" value={form.city} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="المدينة" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الحي</label>
              <input name="district" value={form.district} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="الحي" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">العنوان</label>
              <input name="address" value={form.address} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="العنوان" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الهاتف</label>
              <input name="phone" value={form.phone} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الهاتف" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">الموقع الجغرافي (رابط جوجل ماب أو تحديد مباشر)</label>
              <input name="map" value={form.map} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط جوجل ماب أو تحديد مباشر" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              className="bg-teal-600 text-white px-4 py-2 rounded-full font-bold hover:bg-teal-700 transition-colors duration-200"
              type="submit"
            >
              حفظ
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full font-bold hover:bg-gray-300 transition-colors duration-200"
              type="button"
              onClick={() => navigate('/merchants')}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBranch; 