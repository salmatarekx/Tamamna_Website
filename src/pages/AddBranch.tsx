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
    mobile: '', // رقم الهاتف
    email: '',
    latitude: '',
    longitude: '',
    location_url: '', // رابط الموقع الجغرافي
    branch_photos: [] as File[], // صور الفرع
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper to update map link from lat/lng
  const updateMapFromLatLng = (lat: string, lng: string) => {
    if (lat && lng) {
      setForm(prev => ({ ...prev, location_url: `https://www.google.com/maps?q=${lat},${lng}` }));
    }
  };

  // Helper to update lat/lng from map link if possible
  const updateLatLngFromMap = (map: string) => {
    const match = map.match(/maps\?q=([\d.\-]+),([\d.\-]+)/);
    if (match) {
      setForm(prev => ({ ...prev, latitude: match[1], longitude: match[2], location_url: map }));
    } else {
      setForm(prev => ({ ...prev, location_url: map }));
    }
  };

  // Geolocation fetch
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude.toString();
          const lng = pos.coords.longitude.toString();
          setForm(prev => ({ ...prev, latitude: lat, longitude: lng }));
          updateMapFromLatLng(lat, lng);
        },
        err => alert('تعذر الحصول على الموقع الجغرافي')
      );
    } else {
      alert('المتصفح لا يدعم تحديد الموقع');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    if (type === 'file' && files) {
      if (name === 'branch_photos') {
        setForm(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    setErrors({});
    const newErrors: { [key: string]: string } = {};
    if (!form.branchName) newErrors.branchName = 'اسم الفرع مطلوب';
    if (!form.city) newErrors.city = 'المدينة مطلوبة';
    if (!form.mobile) newErrors.mobile = 'رقم الهاتف مطلوب';
    if (!vendor.idOrCR && !vendor.id) newErrors.vendor = 'رقم التاجر غير متوفر';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
    if (form.latitude && isNaN(Number(form.latitude))) newErrors.latitude = 'خط العرض يجب أن يكون رقمًا';
    if (form.longitude && isNaN(Number(form.longitude))) newErrors.longitude = 'خط الطول يجب أن يكون رقمًا';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const token = localStorage.getItem('agent_token');
    if (!vendor.idOrCR && !vendor.id) {
      alert('يجب اختيار تاجر لإضافة فرع');
      return;
    }
    // Prepare FormData for file upload
    const formData = new FormData();
    formData.append('vendor_id', vendor.idOrCR || vendor.id);
    formData.append('name', form.branchName);
    formData.append('mobile', form.mobile);
    if (form.email) formData.append('email', form.email);
    if (form.address) formData.append('address', form.address);
    if (form.location_url) formData.append('location_url', form.location_url);
    formData.append('city', form.city);
    if (form.district) formData.append('district', form.district);
    if (form.branch_photos && form.branch_photos.length > 0) {
      form.branch_photos.forEach(file => formData.append('branch_photos[]', file));
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/branches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/merchants');
        }, 2000);
      } else {
        const data = await res.json();
        if (data.errors) {
          const apiErrors: { [key: string]: string } = {};
          Object.keys(data.errors).forEach(key => {
            apiErrors[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          });
          setErrors(apiErrors);
        } else {
          alert(data.message || 'فشل في إضافة الفرع');
        }
      }
    } catch (err) {
      alert('حدث خطأ أثناء الاتصال بالخادم');
    }
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
          <div className="mb-4 p-2 bg-gold-light rounded text-brand-green font-bold text-center">
            التاجر: {vendor.commercial_name || vendor.tradeName || vendor.owner_name || ''}
          </div>
        )}
        <form className="space-y-3" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم الفرع</label>
              <input name="branchName" value={form.branchName} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="اسم الفرع" />
              {errors.branchName && <div className="text-red-600 text-sm mt-1">{errors.branchName}</div>}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة</label>
              <input name="city" value={form.city} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="المدينة" />
              {errors.city && <div className="text-red-600 text-sm mt-1">{errors.city}</div>}
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
              <input name="mobile" value={form.mobile} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الهاتف" />
              {errors.mobile && <div className="text-red-600 text-sm mt-1">{errors.mobile}</div>}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني</label>
              <input name="email" value={form.email} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="البريد الإلكتروني" />
              {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">خط العرض (Latitude)</label>
              <input name="latitude" value={form.latitude} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="Latitude" />
              {errors.latitude && <div className="text-red-600 text-sm mt-1">{errors.latitude}</div>}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">خط الطول (Longitude)</label>
              <input name="longitude" value={form.longitude} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="Longitude" />
              {errors.longitude && <div className="text-red-600 text-sm mt-1">{errors.longitude}</div>}
            </div>
            {/* Replace the button's container div with a full-width, centered flexbox */}
            <div className="md:col-span-2 flex justify-center items-center my-2">
              <button type="button" onClick={handleGetLocation} className="bg-gold text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
                تحديد الموقع الحالي
              </button>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <input name="location_url" value={form.location_url} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط الموقع الجغرافي" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صور الفرع (يمكن اختيار أكثر من صورة)</label>
              <input name="branch_photos" type="file" accept="image/*" multiple onChange={handleFormChange} className={inputClass} style={inputStyle} />
            </div>
          </div>
          {errors.vendor && <div className="text-red-600 text-sm mt-1">{errors.vendor}</div>}
          <div className="flex gap-2 mt-4 justify-center">
            <button
              className="bg-gold text-brand-black px-6 py-2 rounded-xl font-bold shadow hover:bg-gold-dark hover:text-brand-white transition-colors duration-200 text-lg min-w-[120px]"
              type="submit"
            >
              حفظ
            </button>
            <button
              className="bg-white border border-gold text-brand-green px-6 py-2 rounded-xl font-bold hover:bg-gold-light transition-colors duration-200 text-lg min-w-[120px]"
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