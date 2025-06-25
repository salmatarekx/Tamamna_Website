import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewMerchant: React.FC = () => {
  const [form, setForm] = useState({
    tradeName: '',
    ownerName: '',
    phone: '',
    idOrCR: '',
    email: '',
    social: '',
    city: '',
    address: '',
    map: '',
    activityType: '',
    branches: '',
    taxStatus: '',
    taxNumber: '',
    startDate: '',
    hasEcom: '',
    previousOffers: '',
    wantsTraining: '',
    hasProductImages: '',
    previousProblems: '',
    requirements: '',
    images: null as FileList | null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    setForm(prev => ({ ...prev, [name]: files ? files : value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      navigate('/merchants');
    }, 2000);
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-full";
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
        <h3 className="text-lg font-bold mb-4 text-teal-700">إضافة تاجر جديد</h3>
        <form className="space-y-3" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold text-gray-700">الاسم التجاري</label>
              <input name="tradeName" value={form.tradeName} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="الاسم التجاري" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم صاحب النشاط</label>
              <input name="ownerName" value={form.ownerName} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="اسم صاحب النشاط" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الجوال</label>
              <input name="phone" value={form.phone} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الجوال" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الهوية أو السجل التجاري</label>
              <input name="idOrCR" value={form.idOrCR} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الهوية أو السجل التجاري" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني</label>
              <input name="email" value={form.email} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="البريد الإلكتروني" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">حسابات التواصل الاجتماعي (واتساب – سناب – إنستغرام)</label>
              <input name="social" value={form.social} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="واتساب – سناب – إنستغرام" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة والحي</label>
              <input name="city" value={form.city} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="المدينة والحي" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الموقع الجغرافي (رابط جوجل ماب أو تحديد مباشر)</label>
              <input name="map" value={form.map} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط جوجل ماب أو تحديد مباشر" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">نوع النشاط</label>
              <select name="activityType" value={form.activityType} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="جملة">جملة</option>
                <option value="تجزئة">تجزئة</option>
                <option value="كليهما">كليهما</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">عدد الفروع المراد الاشتراك بها</label>
              <input name="branches" value={form.branches} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="عدد الفروع" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">السجل الضريبي؟</label>
              <select name="taxStatus" value={form.taxStatus} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
                <option value="غير متأكد">غير متأكد</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم السجل</label>
              <input name="taxNumber" value={form.taxNumber} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم السجل" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">تاريخ بداية النشاط</label>
              <input name="startDate" value={form.startDate} onChange={handleFormChange} type="date" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">حساب في منصات إلكترونية؟</label>
              <select name="hasEcom" value={form.hasEcom} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">عروض سابقة من منصات؟</label>
              <select name="previousOffers" value={form.previousOffers} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الرغبة في التدريب؟</label>
              <select name="wantsTraining" value={form.wantsTraining} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">صور جاهزة للمنتجات؟</label>
              <select name="hasProductImages" value={form.hasProductImages} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="نعم">نعم</option>
                <option value="لا">لا</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">مشاكل سابقة مع المنصات</label>
              <input name="previousProblems" value={form.previousProblems} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="مشاكل سابقة مع المنصات" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">متطلبات التاجر</label>
              <textarea name="requirements" value={form.requirements} onChange={handleFormChange} className="w-full px-3 py-2 border border-gray-300 rounded-2xl" style={inputStyle} placeholder="متطلبات التاجر" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">رفع صور (واجهة المحل، بطاقة السجل، الهوية إلخ)</label>
              <input name="images" type="file" multiple onChange={handleFormChange} className={inputClass} style={inputStyle} />
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

export default AddNewMerchant; 