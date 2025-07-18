import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddNewMerchant: React.FC = () => {
  const [form, setForm] = useState({
    owner_name: '',
    commercial_name: '',
    commercial_registration_number: '',
    mobile: '',
    id_number: '', // رقم الهويه
    license_number: '', // رقم الرخصه
    whatsapp: '',
    snapchat: '',
    instagram: '',
    email: '',
    location_url: '',
    city: '',
    district: '',
    activity_type: '', // enum: wholesale, retail, both
    activity_start_date: '',
    has_commercial_registration: '', // enum: yes, no, not_sure
    has_online_platform: '', // boolean: true/false
    previous_platform_experience: '',
    previous_platform_issues: '',
    has_product_photos: '', // boolean: true/false
    notes: '',
    shop_front_image: null as File | null,
    commercial_registration_image: null as File | null,
    id_image: null as File | null,
    license_photos: null as File | null, // صورة الرخصة
    other_attachments: [] as File[], // مرفقات أخرى
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [merchant, setMerchant] = useState<Record<string, unknown> | null>(null);
  const navigate = useNavigate();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file' && files) {
      if (name === 'other_attachments') {
        setForm(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setForm(prev => ({ ...prev, [name]: files[0] }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
    const token = localStorage.getItem('agent_token');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('agent_token');
    // Prepare FormData for file upload
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (
        key === 'other_attachments' && Array.isArray(value)
      ) {
        value.forEach((file: any) => {
          if (file instanceof File) {
            formData.append('other_attachments[]', file);
          }
        });
      } else if (
        [
          'shop_front_image',
          'commercial_registration_image',
          'id_image',
          'license_photos'
        ].includes(key) && value instanceof File
      ) {
        formData.append(key, value as File);
      } else if (['has_online_platform', 'has_product_photos'].includes(key)) {
        if (value === 'true') {
          formData.append(key, '1');
        } else if (value === 'false') {
          formData.append(key, '0');
        }
      } else if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value as any);
      }
    });
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (response.ok || response.status === 201) {
        const result = await response.json();
        setMerchant(result.data);
        setShowSuccess(true);
        navigate('/add-branch', { state: { vendor: result.data } });
        return;
      } else {
        alert('حدث خطأ أثناء حفظ التاجر.');
      }
    } catch (error) {
      alert('حدث خطأ في الاتصال بالخادم.');
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal";
  const inputStyle = { backgroundColor: '#d6f1e9' };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-16" dir="rtl">
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
        <form className="space-y-3" onSubmit={handleSave} encType="multipart/form-data">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم صاحب النشاط</label>
              <input name="owner_name" value={form.owner_name} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="اسم صاحب النشاط" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الاسم التجاري</label>
              <input name="commercial_name" value={form.commercial_name} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="الاسم التجاري" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم السجل التجاري</label>
              <input name="commercial_registration_number" value={form.commercial_registration_number} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم السجل التجاري" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الجوال</label>
              <input name="mobile" value={form.mobile} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الجوال" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الهويه</label>
              <input name="id_number" value={form.id_number} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الهويه" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الرخصه</label>
              <input name="license_number" value={form.license_number} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الرخصه" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">واتساب</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="واتساب" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">سناب شات</label>
              <input name="snapchat" value={form.snapchat} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="سناب شات" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">انستغرام</label>
              <input name="instagram" value={form.instagram} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="انستغرام" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني</label>
              <input name="email" value={form.email} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="البريد الإلكتروني" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <input name="location_url" value={form.location_url} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط الموقع الجغرافي" />
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
              <label className="block mb-1 font-bold text-gray-700">نوع النشاط</label>
              <select name="activity_type" value={form.activity_type} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="wholesale">جملة</option>
                <option value="retail">تجزئة</option>
                <option value="both">كليهما</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">تاريخ بداية النشاط</label>
              <input name="activity_start_date" value={form.activity_start_date} onChange={handleFormChange} type="date" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد سجل تجاري؟</label>
              <select name="has_commercial_registration" value={form.has_commercial_registration} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
                <option value="not_sure">غير متأكد</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد منصة إلكترونية؟</label>
              <select name="has_online_platform" value={form.has_online_platform} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">خبرة سابقة مع المنصات</label>
              <input name="previous_platform_experience" value={form.previous_platform_experience} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="خبرة سابقة مع المنصات" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">مشاكل سابقة مع المنصات</label>
              <input name="previous_platform_issues" value={form.previous_platform_issues} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="مشاكل سابقة مع المنصات" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد صور للمنتجات؟</label>
              <select name="has_product_photos" value={form.has_product_photos} onChange={handleFormChange} className={inputClass} style={inputStyle}>
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">ملاحظات</label>
              <textarea name="notes" value={form.notes} onChange={handleFormChange} className="w-full px-3 py-2 border border-gold rounded-2xl bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal" style={inputStyle} placeholder="ملاحظات" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة واجهة المحل</label>
              <input name="shop_front_image" type="file" accept="image/*" onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة السجل التجاري</label>
              <input name="commercial_registration_image" type="file" accept="image/*" onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة الهوية</label>
              <input name="id_image" type="file" accept="image/*" onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة الرخصة</label>
              <input name="license_photos" type="file" accept="image/*" onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">مرفقات أخرى (اختياري، يمكن اختيار أكثر من ملف)</label>
              <input name="other_attachments" type="file" accept="image/*,application/pdf" multiple onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="w-full bg-gold text-brand-black py-3 rounded-lg font-bold hover:bg-gold-dark transition-colors duration-200"
              type="submit"
            >
              حفظ وانتقال لاضافه فرع
            </button>
            <button
              className="w-full bg-white border border-gold text-brand-green py-3 rounded-lg font-bold hover:bg-gold-light transition-colors duration-200"
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