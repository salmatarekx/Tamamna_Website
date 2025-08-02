import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // Check authentication on component mount
  React.useEffect(() => {
    const token = localStorage.getItem('agent_token');
    if (!token) {
      alert('يجب تسجيل الدخول أولاً');
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

  // Validation function
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    // Required field validations
    if (!form.owner_name) {
      newErrors.owner_name = 'اسم صاحب النشاط مطلوب';
    }
    
    if (!form.mobile) {
      newErrors.mobile = 'رقم الجوال مطلوب';
    }
    
    if (!form.whatsapp) {
      newErrors.whatsapp = 'رقم الواتساب مطلوب';
    }
    
    if (!form.city) {
      newErrors.city = 'المدينة مطلوبة';
    }
    
    if (!form.has_commercial_registration) {
      newErrors.has_commercial_registration = 'هل يوجد سجل تجاري؟ مطلوب';
    }
    
    if (!form.activity_type) {
      newErrors.activity_type = 'نوع النشاط مطلوب';
    }
    
    if (!form.commercial_name) {
      newErrors.commercial_name = 'الاسم التجاري مطلوب';
    }
    
    if (!form.email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    // Commercial registration number validation
    if (!form.commercial_registration_number) {
      newErrors.commercial_registration_number = 'رقم السجل التجاري مطلوب';
    } else if (form.commercial_registration_number.length !== 10) {
      newErrors.commercial_registration_number = 'رقم السجل التجاري يجب أن يكون 10 أرقام بالضبط';
    }
    
    // ID number validation
    if (!form.id_number) {
      newErrors.id_number = 'رقم الهوية مطلوب';
    } else if (form.id_number.length !== 10) {
      newErrors.id_number = 'رقم الهوية يجب أن يكون 10 أرقام بالضبط';
    }
    
    // License number validation
    if (!form.license_number) {
      newErrors.license_number = 'رقم الرخصة مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    const token = localStorage.getItem('agent_token');
    
    // Check if token exists
    if (!token) {
      alert('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }
    
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
      if (response.ok || response.status === 201) {
        const result = await response.json();
        setMerchant(result.data);
        setShowSuccess(true);
        navigate('/add-branch', { state: { vendor: result.data } });
        return;
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          alert('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('agent_token');
          navigate('/login');
        } else {
          alert(`حدث خطأ أثناء حفظ التاجر: ${errorData.message || 'خطأ غير معروف'}`);
        }
      }
    } catch (error) {
      console.error('Error:', error);
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
              <label className="block mb-1 font-bold text-gray-700">اسم صاحب النشاط *</label>
              <input 
                name="owner_name" 
                value={form.owner_name} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.owner_name ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="اسم صاحب النشاط" 
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
              />
              {errors.commercial_name && (
                <div className="mt-1 text-sm text-red-600">{errors.commercial_name}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم السجل التجاري *</label>
              <input 
                name="commercial_registration_number" 
                value={form.commercial_registration_number} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.commercial_registration_number ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="10 أرقام فقط" 
                maxLength={10}
              />
              {errors.commercial_registration_number && (
                <div className="mt-1 text-sm text-red-600">{errors.commercial_registration_number}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الجوال *</label>
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
              <label className="block mb-1 font-bold text-gray-700">رقم الهويه *</label>
              <input 
                name="id_number" 
                value={form.id_number} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.id_number ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="10 أرقام فقط" 
                maxLength={10}
              />
              {errors.id_number && (
                <div className="mt-1 text-sm text-red-600">{errors.id_number}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رقم الرخصه *</label>
              <input 
                name="license_number" 
                value={form.license_number} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.license_number ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="رقم الرخصه" 
              />
              {errors.license_number && (
                <div className="mt-1 text-sm text-red-600">{errors.license_number}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">واتساب *</label>
              <div className="relative">
                <div className="flex">
                  {/* WhatsApp Country Code Selector */}
                  <div className="relative whatsapp-country-dropdown">
                    <button
                      type="button"
                      onClick={() => setShowWhatsAppCountryDropdown(!showWhatsAppCountryDropdown)}
                      className="flex items-center gap-2 px-3 py-2 border border-gold rounded-r-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal min-w-[120px]"
                      style={{ backgroundColor: '#d6f1e9' }}
                    >
                      <span className="text-lg">{gccCountries.find(c => c.code === selectedWhatsAppCountryCode)?.flag}</span>
                      <span className="text-sm font-medium">{selectedWhatsAppCountryCode}</span>
                      <span className="text-xs">▼</span>
                    </button>
                    
                    {/* WhatsApp Dropdown Menu */}
                    {showWhatsAppCountryDropdown && (
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
                    className="flex-1 px-3 py-2 border border-gold border-r-0 rounded-l-lg bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal" 
                    style={{ backgroundColor: '#d6f1e9' }}
                    placeholder="9 أرقام فقط" 
                    maxLength={9}
                  />
                  {form.whatsapp && (
                    <div className="absolute -bottom-6 right-0 text-xs text-gray-500">
                      {form.whatsapp.length}/9
                    </div>
                  )}
                </div>
                {errors.whatsapp && (
                  <div className="mt-1 text-sm text-red-600">{errors.whatsapp}</div>
                )}
              </div>
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
              <label className="block mb-1 font-bold text-gray-700">البريد الإلكتروني *</label>
              <input 
                name="email" 
                value={form.email} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.email ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="البريد الإلكتروني" 
                type="email"
              />
              {errors.email && (
                <div className="mt-1 text-sm text-red-600">{errors.email}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">رابط الموقع الجغرافي (Google Maps)</label>
              <input name="location_url" value={form.location_url} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="رابط الموقع الجغرافي" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">المدينة *</label>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.city ? 'border-red-500' : ''}`} 
                style={inputStyle} 
                placeholder="المدينة" 
              />
              {errors.city && (
                <div className="mt-1 text-sm text-red-600">{errors.city}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">الحي</label>
              <input name="district" value={form.district} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="الحي" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">اسم الشارع</label>
              <input name="street_name" value={form.street_name} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="اسم الشارع" />
            </div>
            {/* Activity Type Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">نوع النشاط *</label>
              <select 
                name="activity_type" 
                value={showCustomActivityType ? 'custom' : form.activity_type} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.activity_type ? 'border-red-500' : ''}`} 
                style={inputStyle}
              >
                <option value="">اختر</option>
                <option value="wholesale">جملة</option>
                <option value="retail">تجزئة</option>
                <option value="both">كليهما</option>
                {/* <option value="custom">اختيار آخر</option> */}
              </select>
              {showCustomActivityType && (
                <input 
                  name="activity_type" 
                  value={form.activity_type} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2 ${errors.activity_type ? 'border-red-500' : ''}`} 
                  style={inputStyle} 
                  placeholder="اكتب نوع النشاط المخصص..." 
                />
              )}
              {errors.activity_type && (
                <div className="mt-1 text-sm text-red-600">{errors.activity_type}</div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">تاريخ بداية النشاط</label>
              <input name="activity_start_date" value={form.activity_start_date} onChange={handleFormChange} type="date" className={inputClass} style={inputStyle} />
            </div>
            {/* Commercial Registration Field */}
            <div>
              <label className="block mb-1 font-bold text-gray-700">هل يوجد سجل تجاري؟ *</label>
              <select 
                name="has_commercial_registration" 
                value={showCustomCommercialRegistration ? 'custom' : form.has_commercial_registration} 
                onChange={handleFormChange} 
                className={`${inputClass} ${errors.has_commercial_registration ? 'border-red-500' : ''}`} 
                style={inputStyle}
              >
                <option value="">اختر</option>
                <option value="yes">نعم</option>
                <option value="no">لا</option>
                <option value="not_sure">غير متأكد</option>
                {/* <option value="custom">اختيار آخر</option> */}
              </select>
              {showCustomCommercialRegistration && (
                <input 
                  name="has_commercial_registration" 
                  value={form.has_commercial_registration} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2 ${errors.has_commercial_registration ? 'border-red-500' : ''}`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                />
              )}
              {errors.has_commercial_registration && (
                <div className="mt-1 text-sm text-red-600">{errors.has_commercial_registration}</div>
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
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
                {/* <option value="custom">اختيار آخر</option> */}
              </select>
              {showCustomOnlinePlatform && (
                <input 
                  name="has_online_platform" 
                  value={form.has_online_platform} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                />
              )}
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">خبرة سابقة مع المنصات</label>
              <input name="previous_platform_experience" value={form.previous_platform_experience} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="خبرة سابقة مع المنصات" />
            </div>
            <div>
              <label className="block mb-1 font-bold text-gray-700">مشاكل سابقة مع المنصات</label>
              <input name="previous_platform_issues" value={form.previous_platform_issues} onChange={handleFormChange} className={inputClass} style={inputStyle} placeholder="مشاكل سابقة مع المنصات" />
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
              >
                <option value="">اختر</option>
                <option value="true">نعم</option>
                <option value="false">لا</option>
                {/* <option value="custom">اختيار آخر</option> */}
              </select>
              {showCustomProductPhotos && (
                <input 
                  name="has_product_photos" 
                  value={form.has_product_photos} 
                  onChange={handleFormChange} 
                  className={`${inputClass} mt-2`} 
                  style={inputStyle} 
                  placeholder="اكتب الإجابة المخصصة..." 
                />
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">ملاحظات</label>
              <textarea name="notes" value={form.notes} onChange={handleFormChange} className="w-full px-3 py-2 border border-gold rounded-2xl bg-gold-light text-brand-green focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold font-normal" style={inputStyle} placeholder="ملاحظات" />
            </div>
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold text-gray-700">صورة واجهة المحل</label>
              <div className="relative">
                <input name="shop_front_image" type="file" accept="image/*" onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('shop_front_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
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
                <input name="commercial_registration_image" type="file" accept="image/*" onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('commercial_registration_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
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
                <input name="id_image" type="file" accept="image/*" onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('id_image')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
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
                <input name="license_photos" type="file" accept="image/*" onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('license_photos')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
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
                <input name="other_attachments" type="file" accept="image/*,application/pdf" multiple onChange={handleFormChange} className={`${inputClass} pr-8`} style={inputStyle} />
                <button
                  type="button"
                  onClick={() => handleCameraCapture('other_attachments')}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gold hover:text-gold-dark transition-colors text-2xl"
                  title="التقاط صورة بالكاميرا"
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

export default AddNewMerchant; 