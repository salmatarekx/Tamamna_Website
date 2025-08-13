import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Snackbar Component for Error Messages
const Snackbar: React.FC<{
  message: string;
  type: 'error' | 'success' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, type, isVisible, onClose }) => {
  React.useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto close after 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    error: 'bg-red-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500'
  }[type];

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 max-w-md animate-slide-in`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 text-lg font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
};

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
  const [cameraField, setCameraField] = useState<string | null>(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    message: '',
    type: 'error' as 'error' | 'success' | 'warning',
    isVisible: false
  });

  const gccCountries = [
    { name: 'السعودية', code: '+966', flag: '🇸🇦' },
    { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
    { name: 'الكويت', code: '+965', flag: '🇰🇼' },
    { name: 'قطر', code: '+974', flag: '🇶🇦' },
    { name: 'البحرين', code: '+973', flag: '🇧🇭' },
    { name: 'عمان', code: '+968', flag: '🇴🇲' },
  ];

  const showSnackbar = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
    setSnackbar({
      message,
      type,
      isVisible: true
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  const updateMapFromLatLng = (lat: string, lng: string) => {
    if (lat && lng) {
      // Validate coordinates
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      if (isNaN(latNum) || isNaN(lngNum)) {
        showSnackbar('إحداثيات غير صحيحة', 'error');
        return;
      }
      
      // Check if coordinates are within reasonable bounds
      if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) {
        showSnackbar('إحداثيات خارج النطاق المسموح', 'error');
        return;
      }
      
      // Generate a simple but effective Google Maps URL
      const preciseUrl = `https://www.google.com/maps?q=${latNum.toFixed(7)},${lngNum.toFixed(7)}`;
      
      setForm(prev => ({ 
        ...prev, 
        latitude: lat,
        longitude: lng,
        location_url: preciseUrl
      }));
    }
  };

  const updateLatLngFromMap = (map: string) => {
    // Handle different Google Maps URL formats
    let match = null;
    
    // Try the data format first: !3dlat!4dlng (most precise)
    match = map.match(/!3d([\d.\-]+)!4d([\d.\-]+)/);
    
    if (!match) {
      // Try the @lat,lng format in the URL
      match = map.match(/@([\d.\-]+),([\d.\-]+)/);
    }
    
    if (!match) {
      // Try simple q=lat,lng format
      match = map.match(/maps\?q=([\d.\-]+),([\d.\-]+)/);
    }
    
    if (!match) {
      // Try coordinates in place path
      match = map.match(/maps\/place\/([\d.\-]+),([\d.\-]+)/);
    }
    
    if (!match) {
      // Try the most precise format: maps/place/.../@lat,lng
      match = map.match(/maps\/place\/.*@([\d.\-]+),([\d.\-]+)/);
    }
    
    if (match) {
      const lat = match[1];
      const lng = match[2];
      
      // Validate the extracted coordinates
      const latNum = parseFloat(lat);
      const lngNum = parseFloat(lng);
      
      if (!isNaN(latNum) && !isNaN(lngNum) && 
          latNum >= -90 && latNum <= 90 && 
          lngNum >= -180 && lngNum <= 180) {
        setForm(prev => ({ 
          ...prev, 
          latitude: lat, 
          longitude: lng, 
          location_url: map 
        }));
        showSnackbar('تم استخراج الإحداثيات من الرابط بنجاح', 'success');
      } else {
        showSnackbar('إحداثيات غير صحيحة في الرابط', 'error');
      }
    } else {
      setForm(prev => ({ ...prev, location_url: map }));
      showSnackbar('لم يتم العثور على إحداثيات في الرابط', 'warning');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      showSnackbar('المتصفح لا يدعم تحديد الموقع');
      return;
    }

    // Show loading message
    showSnackbar('جاري تحديد الموقع...', 'warning');

    const options = {
      enableHighAccuracy: true,  // Request high accuracy
      timeout: 15000,           // 15 second timeout
      maximumAge: 0             // Don't use cached location
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = pos.coords.accuracy;

        // Check if accuracy is good enough (less than 50 meters)
        if (accuracy > 50) {
          showSnackbar(`دقة الموقع منخفضة (${Math.round(accuracy)} متر). قد تكون الإحداثيات غير دقيقة. يرجى التحقق من الإحداثيات أو إدخالها يدوياً.`, 'warning');
        }

        // Format coordinates to 6 decimal places for better precision
        const formattedLat = lat.toFixed(6);
        const formattedLng = lng.toFixed(6);

        updateMapFromLatLng(formattedLat, formattedLng);
        
        const accuracyMessage = accuracy <= 50 
          ? 'تم تحديد الموقع بدقة عالية' 
          : `تم تحديد الموقع بدقة ${Math.round(accuracy)} متر - يرجى التحقق من الدقة`;
        
        showSnackbar(accuracyMessage, accuracy <= 50 ? 'success' : 'warning');
      },
      (err) => {
        let errorMessage = 'تعذر الحصول على الموقع الجغرافي';
        
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'تم رفض إذن تحديد الموقع. يرجى السماح بالوصول إلى الموقع في إعدادات المتصفح أو إدخال الإحداثيات يدوياً.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة حالياً. يرجى إدخال الإحداثيات يدوياً.';
            break;
          case err.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع. يرجى المحاولة مرة أخرى أو إدخال الإحداثيات يدوياً.';
            break;
          default:
            errorMessage = 'حدث خطأ غير متوقع أثناء تحديد الموقع. يرجى إدخال الإحداثيات يدوياً.';
        }
        
        showSnackbar(errorMessage, 'error');
      },
      options
    );
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
    else if (name === 'latitude' || name === 'longitude') {
      // Handle manual coordinate input
      const numValue = parseFloat(value);
      if (!isNaN(numValue)) {
        setForm(prev => ({ ...prev, [name]: value }));
        // Update location URL if both coordinates are available
        if (name === 'latitude' && form.longitude) {
          updateMapFromLatLng(value, form.longitude);
        } else if (name === 'longitude' && form.latitude) {
          updateMapFromLatLng(form.latitude, value);
        }
      } else if (value === '') {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    }
    else {
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
    <div className="p-4 max-w-4xl mx-auto mt-16" dir="rtl">
      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 text-center font-bold text-lg shadow">
          تم الحفظ بنجاح
        </div>
      )}

      {/* Snackbar for errors */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />
      
      {/* Fixed Back Button - Always visible at top with proper spacing */}
      <div className="mb-4 sticky top-4 z-10 bg-white py-2">
        <button
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          onClick={() => navigate('/merchants')}
        >
          ← العودة إلى قائمة التجار
        </button>
      </div>

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
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-700 mb-3 text-center">معلومات الموقع الجغرافي</h4>
                
                {/* Location Button */}
                <div className="flex justify-center mb-3">
                  <button 
                    type="button" 
                    onClick={handleGetLocation} 
                    className="bg-gold text-brand-black px-4 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors flex items-center gap-2 text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                    تحديد الموقع الحالي
                  </button>
                </div>
                
                {/* Manual Coordinate Input */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">خط العرض (Latitude)</label>
                    <input 
                      name="latitude" 
                      value={form.latitude} 
                      onChange={handleFormChange} 
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white" 
                      placeholder="مثال: 24.7136" 
                      type="number"
                      step="any"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">خط الطول (Longitude)</label>
                    <input 
                      name="longitude" 
                      value={form.longitude} 
                      onChange={handleFormChange} 
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white" 
                      placeholder="مثال: 46.6753" 
                      type="number"
                      step="any"
                    />
                  </div>
                </div>
                
                {/* Update Coordinates Button */}
                <div className="text-center mb-3">
                  <button 
                    type="button" 
                    onClick={() => {
                      if (form.latitude && form.longitude) {
                        updateMapFromLatLng(form.latitude, form.longitude);
                        showSnackbar('تم تحديث الإحداثيات بنجاح', 'success');
                      } else {
                        showSnackbar('يرجى إدخال خط العرض وخط الطول أولاً', 'warning');
                      }
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-600 transition-colors"
                  >
                    تحديث الإحداثيات
                  </button>
                </div>
              </div>
            </div>

            {/* Map URL */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <div className="flex gap-2">
                <input 
                  name="location_url" 
                  value={form.location_url} 
                  onChange={handleFormChange} 
                  className={`${inputClass} flex-1`} 
                  style={inputStyle} 
                  placeholder="انسخ رابط الموقع من خرائط جوجل وألصقه هنا" 
                />
                <button 
                  type="button" 
                  onClick={() => {
                    if (form.location_url) {
                      updateLatLngFromMap(form.location_url);
                    } else {
                      showSnackbar('يرجى إدخال رابط خرائط جوجل أولاً', 'warning');
                    }
                  }}
                  className="bg-blue-500 text-white px-3 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors text-sm"
                >
                  استخراج الإحداثيات
                </button>
              </div>
            </div>

            {/* Photos */}
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