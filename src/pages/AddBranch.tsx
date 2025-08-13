import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Camera Component
const CameraCapture: React.FC<{
  onCapture: (file: File) => void;
  onClose: () => void;
  isOpen: boolean;
}> = ({ onCapture, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCameraActive(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('تعذر الوصول إلى الكاميرا. يرجى السماح بالوصول إلى الكاميرا.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `camera_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
            onClose();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const handleOpen = () => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
  };

  React.useEffect(() => {
    handleOpen();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-brand-green">التقاط صورة</h3>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg"
            style={{ transform: 'scaleX(-1)' }} // Mirror the video
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={capturePhoto}
            className="bg-gold text-white px-6 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors"
          >
            📸 التقاط الصورة
          </button>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-bold hover:bg-gray-400 transition-colors"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [selectedCountryCode, setSelectedCountryCode] = useState('+966'); // Default to Saudi Arabia
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [cameraField, setCameraField] = useState<string | null>(null);

  // GCC Countries with calling codes
  const gccCountries = [
    { name: 'السعودية', code: '+966', flag: '🇸🇦' },
    { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
    { name: 'الكويت', code: '+965', flag: '🇰🇼' },
    { name: 'قطر', code: '+974', flag: '🇶🇦' },
    { name: 'البحرين', code: '+973', flag: '🇧🇭' },
    { name: 'عمان', code: '+968', flag: '🇴🇲' },
  ];

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
    } else if (name === 'mobile') {
      // Only allow digits and limit to 9 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCameraCapture = (fieldName: string) => {
    setCameraField(fieldName);
  };

  const handleCameraCaptureComplete = (file: File) => {
    setForm(prev => ({ 
      ...prev, 
      branch_photos: [...prev.branch_photos, file] 
    }));
    setCameraField(null);
  };

  const handleCameraClose = () => {
    setCameraField(null);
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
    formData.append('mobile', selectedCountryCode + form.mobile);
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
  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const inputStyle = { backgroundColor: '#d6f1e9' };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-16" dir="rtl">
      {showSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-bold text-lg shadow">
          تم الحفظ بنجاح
        </div>
      )}
      
      {/* Fixed Back Button - Always visible at top with proper spacing */}
      <div className="mb-4 sticky top-4 z-10 bg-white py-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/merchants')}
        >
          ← العودة إلى قائمة التجار
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm animate-fade-in">
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
              <div className="relative">
                <input name="branch_photos" type="file" accept="image/*" multiple onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('branch_photos')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
                >
                  📷
                </button>
              </div>
              {form.branch_photos && form.branch_photos.length > 0 && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار {form.branch_photos.length} صورة</div>
              )}
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
      
      {/* Camera Modal */}
      {cameraField && (
        <CameraCapture
          onCapture={handleCameraCaptureComplete}
          onClose={handleCameraClose}
          isOpen={!!cameraField}
        />
      )}
    </div>
  );
};

export default AddBranch; 