import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';

const AddBranch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const vendor = location.state?.vendor || {};

  const [form, setForm] = useState({
    branchName: '',
    city: '',
    district: '',
    address: '',
    mobile: '',
    email: '',
    latitude: '',
    longitude: '',
    location_url: '',
    branch_photos: [] as File[],
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedCountryCode, setSelectedCountryCode] = useState('+966');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success'|'error'|'info'|'warning'>('error');

  const gccCountries = [
    { name: 'السعودية', code: '+966', flag: '🇸🇦' },
    { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
    { name: 'الكويت', code: '+965', flag: '🇰🇼' },
    { name: 'قطر', code: '+974', flag: '🇶🇦' },
    { name: 'البحرين', code: '+973', flag: '🇧🇭' },
    { name: 'عمان', code: '+968', flag: '🇴🇲' },
  ];

  const showSnackbar = (message: string, severity: 'success'|'error'|'info'|'warning' = 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const updateMapFromLatLng = (lat: string, lng: string) => {
    if (lat && lng) {
      setForm(prev => ({ 
        ...prev, 
        latitude: lat,
        longitude: lng,
        location_url: `https://www.google.com/maps?q=${lat},${lng}` 
      }));
    }
  };

  const updateLatLngFromMap = (map: string) => {
    const match = map.match(/maps\?q=([\d.\-]+),([\d.\-]+)/);
    if (match) {
      setForm(prev => ({ 
        ...prev, 
        latitude: match[1], 
        longitude: match[2], 
        location_url: map 
      }));
    } else {
      setForm(prev => ({ ...prev, location_url: map }));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude.toString();
          const lng = pos.coords.longitude.toString();
          updateMapFromLatLng(lat, lng);
          showSnackbar('تم تحديد الموقع بنجاح', 'success');
        },
        err => showSnackbar('تعذر الحصول على الموقع الجغرافي')
      );
    } else {
      showSnackbar('المتصفح لا يدعم تحديد الموقع');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files) {
      if (name === 'branch_photos') {
        setForm(prev => ({ ...prev, [name]: Array.from(files) }));
      }
    } 
    else if (name === 'mobile') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } 
    else if (name === 'location_url') {
      updateLatLngFromMap(value);
    }
    else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(false);
    setErrors({});
    
    // Basic validation
    const newErrors: { [key: string]: string } = {};
    if (!form.branchName) newErrors.branchName = 'اسم الفرع مطلوب';
    if (!form.city) newErrors.city = 'المدينة مطلوبة';
    if (!form.mobile) newErrors.mobile = 'رقم الهاتف مطلوب';
    if (!vendor.idOrCR && !vendor.id) newErrors.vendor = 'رقم التاجر غير متوفر';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'البريد الإلكتروني غير صالح';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showSnackbar('الرجاء إكمال الحقول المطلوبة');
      return;
    }

    const token = localStorage.getItem('agent_token');
    if (!vendor.idOrCR && !vendor.id) {
      showSnackbar('يجب اختيار تاجر لإضافة فرع');
      return;
    }

    const formData = new FormData();
    formData.append('vendor_id', vendor.idOrCR || vendor.id);
    formData.append('name', form.branchName);
    formData.append('mobile', selectedCountryCode + form.mobile);
    if (form.email) formData.append('email', form.email);
    if (form.address) formData.append('address', form.address);
    if (form.location_url) formData.append('location_url', form.location_url);
    formData.append('city', form.city);
    if (form.district) formData.append('district', form.district);
    form.branch_photos.forEach(file => formData.append('branch_photos[]', file));

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/branches`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (res.ok) {
        setShowSuccess(true);
        showSnackbar('تم إضافة الفرع بنجاح', 'success');
        setTimeout(() => navigate('/merchants'), 2000);
      } else {
        const data = await res.json();
        
        if (data.errors) {
          const apiErrors: { [key: string]: string } = {};
          Object.keys(data.errors).forEach(key => {
            apiErrors[key] = Array.isArray(data.errors[key]) ? data.errors[key][0] : data.errors[key];
          });
          setErrors(apiErrors);
          showSnackbar('راجع الحقول المطلوبة');
        } else {
          showSnackbar(data.message || 'فشل في إضافة الفرع');
        }
      }
    } catch (err) {
      showSnackbar('حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal";
  const inputStyle = { backgroundColor: '#d6f1e9' };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto" dir="rtl">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-bold text-lg shadow">
          تم الحفظ بنجاح
        </div>
      )}

      {/* Snackbar for errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <button
        className="mt-[50px] mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300"
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
            {/* Branch Name */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم الفرع</label>
              <input 
                name="branchName" 
                value={form.branchName} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="اسم الفرع" 
              />
              {errors.branchName && <div className="text-red-600 text-sm mt-1">{errors.branchName}</div>}
            </div>

            {/* City */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة</label>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="المدينة" 
              />
              {errors.city && <div className="text-red-600 text-sm mt-1">{errors.city}</div>}
            </div>

            {/* District */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">الحي</label>
              <input 
                name="district" 
                value={form.district} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="الحي" 
              />
            </div>

            {/* Address */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">العنوان</label>
              <input 
                name="address" 
                value={form.address} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="العنوان" 
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الهاتف</label>
              <div className="relative">
                <div className="flex">
                  {/* Country Code Selector */}
                  <div className="relative country-dropdown">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 border border-gold rounded-r-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal min-w-[120px]"
                      style={{ backgroundColor: '#d6f1e9' }}
                    >
                      <span className="text-lg">{gccCountries.find(c => c.code === selectedCountryCode)?.flag}</span>
                      <span className="text-sm font-medium">{selectedCountryCode}</span>
                      <span className="text-xs">▼</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {gccCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountryCode(country.code);
                              setShowCountryDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2 text-right hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm font-medium text-gray-700">{country.name}</span>
                            <span className="text-xs text-gray-500 mr-auto">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Number Input */}
                  <input 
                    name="mobile" 
                    value={form.mobile} 
                    onChange={handleFormChange} 
                    className="flex-1 px-3 py-2 border border-gold border-r-0 rounded-l-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal" 
                    style={{ backgroundColor: '#d6f1e9' }}
                    placeholder="9 أرقام فقط" 
                    maxLength={9}
                  />
                  {form.mobile && (
                    <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                      {form.mobile.length}/9
                    </div>
                  )}
                </div>
                {errors.mobile && (
                  <div className="mt-1 text-sm text-red-600">{errors.mobile}</div>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="البريد الإلكتروني" 
              />
              {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
            </div>

            {/* Location Fields */}
            <div className="md:col-span-2 flex justify-center items-center my-2">
              <button 
                type="button" 
                onClick={handleGetLocation} 
                className="bg-gold text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
                تحديد الموقع الحالي
              </button>
            </div>

            {/* Map URL */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <input 
                name="location_url" 
                value={form.location_url} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="رابط الموقع الجغرافي" 
              />
            </div>

            {/* Photos */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صور الفرع (يمكن اختيار أكثر من صورة)</label>
              <input 
                name="branch_photos" 
                type="file" 
                accept="image/*" 
                multiple 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
              />
            </div>
          </div>

          {errors.vendor && <div className="text-red-600 text-sm mt-1">{errors.vendor}</div>}

          {/* Form Actions */}
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