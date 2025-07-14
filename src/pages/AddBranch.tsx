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
    email: '',
    latitude: '',
    longitude: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Helper to update map link from lat/lng
  const updateMapFromLatLng = (lat: string, lng: string) => {
    if (lat && lng) {
      setForm(prev => ({ ...prev, map: `https://www.google.com/maps?q=${lat},${lng}` }));
    }
  };

  // Helper to update lat/lng from map link if possible
  const updateLatLngFromMap = (map: string) => {
    const match = map.match(/maps\?q=([\d.\-]+),([\d.\-]+)/);
    if (match) {
      setForm(prev => ({ ...prev, latitude: match[1], longitude: match[2], map }));
    } else {
      setForm(prev => ({ ...prev, map }));
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
    const { name, value } = e.target;
    if (name === 'latitude' || name === 'longitude') {
      setForm(prev => {
        const updated = { ...prev, [name]: value };
        if (updated.latitude && updated.longitude) {
          updated.map = `https://www.google.com/maps?q=${updated.latitude},${updated.longitude}`;
        }
        return updated;
      });
    } else if (name === 'map') {
      updateLatLngFromMap(value);
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!"); // Debug log
    setShowSuccess(false);
    setErrors({});
    // Frontend validation
    const newErrors: { [key: string]: string } = {};
    if (!form.branchName) newErrors.branchName = 'اسم الفرع مطلوب';
    if (!form.city) newErrors.city = 'المدينة مطلوبة';
    if (!form.phone) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!vendor.idOrCR && !vendor.id) newErrors.vendor = 'رقم التاجر غير متوفر';
    // Optional: validate email format
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
    // Optional: validate lat/lng as numbers
    if (form.latitude && isNaN(Number(form.latitude))) newErrors.latitude = 'خط العرض يجب أن يكون رقمًا';
    if (form.longitude && isNaN(Number(form.longitude))) newErrors.longitude = 'خط الطول يجب أن يكون رقمًا';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Prepare API payload
    const token = localStorage.getItem('agent_token');
    if (!vendor.idOrCR && !vendor.id) {
      alert('يجب اختيار تاجر لإضافة فرع');
      return;
    }
    const payload: any = {
      vendor_id: vendor.idOrCR || vendor.id, // Adjust as needed
      name: form.branchName,
      mobile: form.phone,
      email: form.email || undefined,
      address: form.address || undefined,
      location_url: form.map || undefined,
      city: form.city,
      district: form.district || undefined,
      // latitude/longitude are not sent unless backend expects them
    };
    Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
    console.log("Sending fetch to:", `${import.meta.env.VITE_API_URL}/api/branches`, payload);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/branches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate('/merchants');
        }, 2000);
      } else {
        const data = await res.json();
        // Handle backend validation errors
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
            التاجر: {vendor.tradeName || ''}
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
              <input name="phone" value={form.phone} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رقم الهاتف" />
              {errors.phone && <div className="text-red-600 text-sm mt-1">{errors.phone}</div>}
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
            <div className="flex items-center gap-2">
              <button type="button" onClick={handleGetLocation} className="bg-gold text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors">تحديد الموقع الحالي</button>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">الموقع الجغرافي (رابط جوجل ماب أو تحديد مباشر)</label>
              <input name="map" value={form.map} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط جوجل ماب أو تحديد مباشر" />
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