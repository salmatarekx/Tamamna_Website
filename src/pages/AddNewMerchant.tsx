import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
          <h3 className="text-lg font-bold text-green-600">التقاط صورة</h3>
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
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-yellow-600 transition-colors"
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
    latitude: '', // إضافة latitude
    longitude: '', // إضافة longitude
    city: '',
    district: '',
    street_name: '',
    activity_type: '',
    activity_start_date: '',
    has_commercial_registration: '',
    has_online_platform: '',
    previous_platform_experience: '',
    previous_platform_issues: '',
    has_product_photos: '',
    notes: '',
    shop_front_image: null as File | null,
    commercial_registration_image: null as File | null,
    id_image: null as File | null,
    license_photos: null as File | null,
    other_attachments: [] as File[],
  });

  const [cameraField, setCameraField] = useState<string | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+966'); // Default to Saudi Arabia
  const [selectedWhatsAppCountryCode, setSelectedWhatsAppCountryCode] = useState('+966'); // Default to Saudi Arabia
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    isVisible: false,
    message: '',
    type: 'error' as 'error' | 'success' | 'warning'
  });

  const showSnackbar = (message: string, type: 'error' | 'success' | 'warning' = 'error') => {
    setSnackbar({
      isVisible: true,
      message,
      type
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  // GCC Countries with calling codes
  const gccCountries = [
    { name: 'السعودية', code: '+966', flag: '🇸🇦' },
    { name: 'الإمارات', code: '+971', flag: '🇦🇪' },
    { name: 'الكويت', code: '+965', flag: '🇰🇼' },
    { name: 'قطر', code: '+974', flag: '🇶🇦' },
    { name: 'البحرين', code: '+973', flag: '🇧🇭' },
    { name: 'عمان', code: '+968', flag: '🇴🇲' },
  ];

  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showWhatsAppCountryDropdown, setShowWhatsAppCountryDropdown] = useState(false);
  
  // Custom option states
  const [showCustomActivityType, setShowCustomActivityType] = useState(false);
  const [showCustomCommercialRegistration, setShowCustomCommercialRegistration] = useState(false);
  const [showCustomOnlinePlatform, setShowCustomOnlinePlatform] = useState(false);
  const [showCustomProductPhotos, setShowCustomProductPhotos] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Check authentication on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('agent_token');
    if (!token) {
      showSnackbar('يجب تسجيل الدخول أولاً', 'warning');
      navigate('/login');
    }
  }, [navigate]);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.country-dropdown')) {
        setShowCountryDropdown(false);
      }
      if (!target.closest('.whatsapp-country-dropdown')) {
        setShowWhatsAppCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    if (type === 'file' && files) {
      if (name === 'other_attachments') {
        setForm(prev => ({ ...prev, [name]: Array.from(files) }));
      } else {
        setForm(prev => ({ ...prev, [name]: files[0] }));
      }
    } else if (name === 'mobile' || name === 'whatsapp') {
      // Only allow digits and limit to 9 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 9) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else if (name === 'commercial_registration_number') {
      // Only allow digits and limit to exactly 10 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else if (name === 'id_number') {
      // Only allow digits and limit to exactly 10 characters
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly.length <= 10) {
        setForm(prev => ({ ...prev, [name]: digitsOnly }));
      }
    } else if (name === 'activity_type') {
      if (e.target.tagName === 'SELECT' && value === 'custom') {
        setShowCustomActivityType(true);
        setForm(prev => ({ ...prev, [name]: '' }));
      } else if (e.target.tagName === 'SELECT' && value !== 'custom') {
        setShowCustomActivityType(false);
        setForm(prev => ({ ...prev, [name]: value }));
      } else {
        // This is from the custom input field
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'has_commercial_registration') {
      if (e.target.tagName === 'SELECT' && value === 'custom') {
        setShowCustomCommercialRegistration(true);
        setForm(prev => ({ ...prev, [name]: '' }));
      } else if (e.target.tagName === 'SELECT' && value !== 'custom') {
        setShowCustomCommercialRegistration(false);
        setForm(prev => ({ ...prev, [name]: value }));
      } else {
        // This is from the custom input field
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'has_online_platform') {
      if (e.target.tagName === 'SELECT' && value === 'custom') {
        setShowCustomOnlinePlatform(true);
        setForm(prev => ({ ...prev, [name]: '' }));
      } else if (e.target.tagName === 'SELECT' && value !== 'custom') {
        setShowCustomOnlinePlatform(false);
        setForm(prev => ({ ...prev, [name]: value }));
      } else {
        // This is from the custom input field
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === 'has_product_photos') {
      if (e.target.tagName === 'SELECT' && value === 'custom') {
        setShowCustomProductPhotos(true);
        setForm(prev => ({ ...prev, [name]: '' }));
      } else if (e.target.tagName === 'SELECT' && value !== 'custom') {
        setShowCustomProductPhotos(false);
        setForm(prev => ({ ...prev, [name]: value }));
      } else {
        // This is from the custom input field
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCameraCapture = (fieldName: string) => {
    setCameraField(fieldName);
  };

  const handleCameraCaptureComplete = (file: File) => {
    setForm(prev => ({ ...prev, [cameraField!]: file }));
    setCameraField(null);
  };

  const handleCameraClose = () => {
    setCameraField(null);
  };

  // Get current location and generate Google Maps URL
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      showSnackbar('المتصفح لا يدعم خدمة تحديد الموقع', 'error');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        
        setForm(prev => ({ 
          ...prev, 
          location_url: googleMapsUrl,
          latitude: latitude.toString(),
          longitude: longitude.toString()
        }));
        
        showSnackbar('تم الحصول على الموقع بنجاح', 'success');
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'فشل في الحصول على الموقع';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض الإذن للوصول إلى الموقع. يرجى السماح بالوصول للموقع في إعدادات المتصفح';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'معلومات الموقع غير متوفرة';
            break;
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة طلب الموقع. يرجى المحاولة مرة أخرى';
            break;
        }
        
        showSnackbar(errorMessage, 'error');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Only keep essential required field validations
    if (!form.owner_name) {
      newErrors.owner_name = 'اسم صاحب النشاط مطلوب';
    }
    
    if (!form.mobile) {
      newErrors.mobile = 'رقم الجوال مطلوب';
    }
    
    if (!form.commercial_name) {
      newErrors.commercial_name = 'الاسم التجاري مطلوب';
    }
    
    // Email validation (only if provided)
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    // Commercial registration number validation (only if provided)
    if (form.commercial_registration_number && form.commercial_registration_number.length !== 10) {
      newErrors.commercial_registration_number = 'رقم السجل التجاري يجب أن يكون 10 أرقام بالضبط';
    }
    
    // ID number validation (only if provided)
    if (form.id_number && form.id_number.length !== 10) {
      newErrors.id_number = 'رقم الهوية يجب أن يكون 10 أرقام بالضبط';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      showSnackbar('يرجى تصحيح الأخطاء في النموذج قبل الإرسال', 'warning');
      return;
    }
    
    const token = localStorage.getItem('agent_token');
    
    // Check if token exists
    if (!token) {
      showSnackbar('يجب تسجيل الدخول أولاً', 'warning');
      navigate('/login');
      return;
    }
    
    setIsSubmitting(true);
    
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
          'license_photos',
          'other_attachments'
        ].includes(key) && value instanceof File
      ) {
        formData.append(key, value as File);
      } else if (key === 'mobile' && value !== undefined && value !== null && value !== '') {
        // Combine country code with phone number
        const fullPhoneNumber = selectedCountryCode + value;
        formData.append(key, fullPhoneNumber);
      } else if (key === 'whatsapp' && value !== undefined && value !== null && value !== '') {
        // Combine country code with WhatsApp number
        const fullWhatsAppNumber = selectedWhatsAppCountryCode + value;
        formData.append(key, fullWhatsAppNumber);
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

      const result = await response.json();

      if (response.ok || response.status === 201) {
        setMerchant(result.data);
        setShowSuccess(true);
        showSnackbar('تم حفظ التاجر بنجاح', 'success');
        navigate('/add-branch', { state: { vendor: result.data } });
        return;
      } else {
        // Handle different types of errors
        if (response.status === 401) {
          showSnackbar('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى', 'warning');
          localStorage.removeItem('agent_token');
          navigate('/login');
        } else if (response.status === 422) {
          // Handle validation errors from server
          if (result.errors && typeof result.errors === 'object') {
            // Set field-specific errors
            const serverErrors: {[key: string]: string} = {};
            Object.keys(result.errors).forEach(field => {
              const errorMessages = result.errors[field];
              if (Array.isArray(errorMessages)) {
                serverErrors[field] = errorMessages[0]; // Take first error message
              } else if (typeof errorMessages === 'string') {
                serverErrors[field] = errorMessages;
              }
            });
            setErrors(serverErrors);
            
            // Show general validation error message
            showSnackbar(result.message || 'يوجد أخطاء في البيانات المدخلة', 'error');
          } else {
            showSnackbar(result.message || 'يوجد أخطاء في البيانات المدخلة', 'error');
          }
        } else if (response.status >= 500) {
          showSnackbar('حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً', 'error');
        } else {
          showSnackbar(result.message || 'حدث خطأ أثناء حفظ التاجر', 'error');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      showSnackbar('حدث خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-yellow-400 rounded-lg bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal";
  const inputStyle = { backgroundColor: '#d6f1e9' };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-16" dir="rtl">
      {/* Snackbar */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={hideSnackbar}
      />

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
              <label className="block mb-1 font-bold text-gray-700">اسم صاحب النشاط *</label>
              <input 
                name="owner_name" 
                value={form.owner_name} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.owner_name ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="اسم صاحب النشاط" 
                disabled={isSubmitting}
              />
              {errors.owner_name && (
                <div className="mt-1 text-sm text-red-600">{errors.owner_name}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الاسم التجاري *</label>
              <input 
                name="commercial_name" 
                value={form.commercial_name} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.commercial_name ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="الاسم التجاري" 
                disabled={isSubmitting}
              />
              {errors.commercial_name && (
                <div className="mt-1 text-sm text-red-600">{errors.commercial_name}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم السجل التجاري</label>
              <input 
                name="commercial_registration_number" 
                value={form.commercial_registration_number} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="10 أرقام فقط" 
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الجوال *</label>
              <div className="relative">
                <div className="flex">
                  {/* Country Code Selector */}
                  <div className="relative country-dropdown">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 border border-yellow-400 rounded-r-lg bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal min-w-[120px] disabled:opacity-50"
                      style={{ backgroundColor: '#d6f1e9' }}
                      disabled={isSubmitting}
                    >
                      <span className="text-lg">{gccCountries.find(c => c.code === selectedCountryCode)?.flag}</span>
                      <span className="text-sm font-medium">{selectedCountryCode}</span>
                      <span className="text-xs">▼</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {showCountryDropdown && !isSubmitting && (
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
                    className={`flex-1 px-3 py-2 border border-yellow-400 border-r-0 rounded-l-lg bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal ${errors.mobile ? 'border-red-500' : ''}`}
                    style={{ backgroundColor: '#d6f1e9' }}
                    placeholder="9 أرقام فقط" 
                    maxLength={9}
                    disabled={isSubmitting}
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
              <label className="block mb-1 font-bold text-gray-700">رقم الهويه</label>
              <input 
                name="id_number" 
                value={form.id_number} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="10 أرقام فقط" 
                maxLength={10}
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الرخصه</label>
              <input 
                name="license_number" 
                value={form.license_number} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="رقم الرخصه" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">واتساب</label>
              <div className="relative">
                <div className="flex">
                  {/* WhatsApp Country Code Selector */}
                  <div className="relative whatsapp-country-dropdown">
                    <button
                      type="button"
                      onClick={() => !isSubmitting && setShowWhatsAppCountryDropdown(!showWhatsAppCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 border border-yellow-400 rounded-r-lg bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal min-w-[120px] disabled:opacity-50"
                      style={{ backgroundColor: '#d6f1e9' }}
                      disabled={isSubmitting}
                    >
                      <span className="text-lg">{gccCountries.find(c => c.code === selectedWhatsAppCountryCode)?.flag}</span>
                      <span className="text-sm font-medium">{selectedWhatsAppCountryCode}</span>
                      <span className="text-xs">▼</span>
                    </button>
                    
                    {/* WhatsApp Dropdown Menu */}
                    {showWhatsAppCountryDropdown && !isSubmitting && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                        {gccCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedWhatsAppCountryCode(country.code);
                              setShowWhatsAppCountryDropdown(false);
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
                  
                  {/* WhatsApp Number Input */}
                  <input 
                    name="whatsapp" 
                    value={form.whatsapp} 
                    onChange={handleFormChange} 
                    className="flex-1 px-3 py-2 border border-yellow-400 border-r-0 rounded-l-lg bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal"
                    style={{ backgroundColor: '#d6f1e9' }}
                    placeholder="9 أرقام فقط" 
                    maxLength={9}
                    disabled={isSubmitting}
                  />
                  {form.whatsapp && (
                    <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                      {form.whatsapp.length}/9
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">سناب شات</label>
              <input 
                name="snapchat" 
                value={form.snapchat} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="سناب شات" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">انستغرام</label>
              <input 
                name="instagram" 
                value={form.instagram} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="انستغرام" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="البريد الإلكتروني" 
                type="email"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <div className="relative flex gap-2">
                <input 
                  name="location_url" 
                  value={form.location_url} 
                  onChange={handleFormChange} 
                  className={`${inputClass} flex-1`} 
                  style={inputStyle} 
                  placeholder="رابط الموقع الجغرافي" 
                  disabled={isSubmitting || isGettingLocation}
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isSubmitting || isGettingLocation}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  title="الحصول على الموقع الحالي"
                >
                  {isGettingLocation ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                      جاري...
                    </>
                  ) : (
                    <>
                      📍 موقعي
                    </>
                  )}
                </button>
              </div>
              {form.location_url && (
                <div className="mt-2">
                  <a 
                    href={form.location_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm underline"
                  >
                    فتح الموقع في خرائط Google
                  </a>
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة</label>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="المدينة" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الحي</label>
              <input 
                name="district" 
                value={form.district} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="الحي" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم الشارع</label>
              <input 
                name="street_name" 
                value={form.street_name} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="اسم الشارع" 
                disabled={isSubmitting}
              />
            </div>
            {/* Activity Type Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">نوع النشاط</label>
              <select 
                name="activity_type" 
                value={showCustomActivityType ? 'custom' : form.activity_type} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle}
                disabled={isSubmitting}
              >
                <option value="">اختر</option>
                <option value="wholesale">جملة</option>
                <option value="retail">تجزئة</option>
                <option value="both">كليهما</option>
              </select>
              {showCustomActivityType && (
                <input 
                  name="activity_type" 
                  value={form.activity_type} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب نوع النشاط المخصص..." 
                  disabled={isSubmitting}
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">تاريخ بداية النشاط</label>
              <input 
                name="activity_start_date" 
                value={form.activity_start_date} 
                onChange={handleFormChange} 
                type="date" 
                className={inputClass} 
                style={inputStyle} 
                disabled={isSubmitting}
              />
            </div>
            {/* Commercial Registration Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد سجل تجاري؟</label>
              <select 
                name="has_commercial_registration" 
                value={showCustomCommercialRegistration ? 'custom' : form.has_commercial_registration} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle}
                disabled={isSubmitting}
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
                <option value="not_sure">غير متأكد</option>
              </select>
              {showCustomCommercialRegistration && (
                <input 
                  name="has_commercial_registration" 
                  value={form.has_commercial_registration} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                  disabled={isSubmitting}
                />
              )}
            </div>
            {/* Online Platform Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد منصة إلكترونية؟</label>
              <select 
                name="has_online_platform" 
                value={showCustomOnlinePlatform ? 'custom' : form.has_online_platform} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle}
                disabled={isSubmitting}
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </select>
              {showCustomOnlinePlatform && (
                <input 
                  name="has_online_platform" 
                  value={form.has_online_platform} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                  disabled={isSubmitting}
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">خبرة سابقة مع المنصات</label>
              <input 
                name="previous_platform_experience" 
                value={form.previous_platform_experience} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="خبرة سابقة مع المنصات" 
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">مشاكل سابقة مع المنصات</label>
              <input 
                name="previous_platform_issues" 
                value={form.previous_platform_issues} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle} 
                placeholder="مشاكل سابقة مع المنصات" 
                disabled={isSubmitting}
              />
            </div>
            {/* Product Photos Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد صور للمنتجات؟</label>
              <select 
                name="has_product_photos" 
                value={showCustomProductPhotos ? 'custom' : form.has_product_photos} 
                onChange={handleFormChange} 
                className={inputClass} 
                style={inputStyle}
                disabled={isSubmitting}
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
              </select>
              {showCustomProductPhotos && (
                <input 
                  name="has_product_photos" 
                  value={form.has_product_photos} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                  disabled={isSubmitting}
                />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">ملاحظات</label>
              <textarea 
                name="notes" 
                value={form.notes} 
                onChange={handleFormChange} 
                className="w-full px-3 py-2 border border-yellow-400 rounded-2xl bg-green-50 text-green-800 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400 font-normal" 
                style={inputStyle} 
                placeholder="ملاحظات" 
                disabled={isSubmitting}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة واجهة المحل</label>
              <div className="relative">
                <input 
                  name="shop_front_image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFormChange} 
                  className={`${inputClass} pr-8`} 
                  style={inputStyle} 
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => !isSubmitting && handleCameraCapture('shop_front_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors text-2xl disabled:opacity-50"
                  title="التقاط صورة بالكاميرا"
                  disabled={isSubmitting}
                >
                  📷
                </button>
              </div>
              {form.shop_front_image && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار صورة</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة السجل التجاري</label>
              <div className="relative">
                <input 
                  name="commercial_registration_image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFormChange} 
                  className={`${inputClass} pr-8`} 
                  style={inputStyle} 
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => !isSubmitting && handleCameraCapture('commercial_registration_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors text-2xl disabled:opacity-50"
                  title="التقاط صورة بالكاميرا"
                  disabled={isSubmitting}
                >
                  📷
                </button>
              </div>
              {form.commercial_registration_image && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار صورة</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة الهوية</label>
              <div className="relative">
                <input 
                  name="id_image" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFormChange} 
                  className={`${inputClass} pr-8`} 
                  style={inputStyle} 
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => !isSubmitting && handleCameraCapture('id_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors text-2xl disabled:opacity-50"
                  title="التقاط صورة بالكاميرا"
                  disabled={isSubmitting}
                >
                  📷
                </button>
              </div>
              {form.id_image && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار صورة</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة الرخصة</label>
              <div className="relative">
                <input 
                  name="license_photos" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFormChange} 
                  className={`${inputClass} pr-8`} 
                  style={inputStyle} 
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => !isSubmitting && handleCameraCapture('license_photos')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors text-2xl disabled:opacity-50"
                  title="التقاط صورة بالكاميرا"
                  disabled={isSubmitting}
                >
                  📷
                </button>
              </div>
              {form.license_photos && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار صورة</div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">مرفقات أخرى (اختياري، يمكن اختيار أكثر من ملف)</label>
              <div className="relative">
                <input 
                  name="other_attachments" 
                  type="file" 
                  accept="image/*,application/pdf" 
                  multiple 
                  onChange={handleFormChange} 
                  className={`${inputClass} pr-8`} 
                  style={inputStyle} 
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => !isSubmitting && handleCameraCapture('other_attachments')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-yellow-500 hover:text-yellow-600 transition-colors text-2xl disabled:opacity-50"
                  title="التقاط صورة بالكاميرا"
                  disabled={isSubmitting}
                >
                  📷
                </button>
              </div>
              {form.other_attachments && form.other_attachments.length > 0 && (
                <div className="mt-2 text-sm text-green-600">✓ تم اختيار ملفات</div>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            <button
              className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2"></div>
                  جاري الحفظ...
                </>
              ) : (
                'حفظ وانتقال لاضافه فرع'
              )}
            </button>
            <button
              className="w-full bg-white border border-yellow-500 text-green-800 py-3 rounded-lg font-bold hover:bg-green-50 transition-colors duration-200 disabled:opacity-50"
              type="button"
              onClick={() => navigate('/merchants')}
              disabled={isSubmitting}
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
      {cameraField && (
        <CameraCapture
          onCapture={handleCameraCaptureComplete}
          onClose={handleCameraClose}
          isOpen={!!cameraField}
        />
      )}
      
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddNewMerchant;