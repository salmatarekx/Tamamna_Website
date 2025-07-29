import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PackageSelection from './PackageSelection';
import { FaCamera } from 'react-icons/fa';

// Camera Component
const CameraCapture: React.FC<{
  onCapture: (file: File) => void;
  onClose: () => void;
  isOpen: boolean;
}> = ({ onCapture, onClose, isOpen }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
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
            const file = new File([blob], `signature_${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            stopCamera();
            onClose();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-[#0F4C5C]">التقاط صورة للتوقيع</h3>
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
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={capturePhoto}
            className="bg-[#0F4C5C] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#0A3641] transition-colors"
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

const VisitReport: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const merchant = location.state?.merchant || {};
  const branch = location.state?.branch || {};

  // State for all fields
  const [form, setForm] = useState({
    vendor_id: merchant.id || '',
    branch_id: branch.id || '',
    visit_date: '',
    notes: '',
    visit_status: '',
    vendor_rating: '',
    audio_recording: null as File | null,
    video_recording: null as File | null,
    agent_notes: '',
    internal_notes: '',
    signature_image: null as File | null,
    gps_latitude: '',
    gps_longitude: '',
    package_id: '',
    visit_end_at: '',
    met_person_name: '', // اسم المسؤل الدي قابلته
    met_person_role: '', // دور المسؤول
    delivery_service_requested: '', // طلب خدمه تصوير (as string for select)
  });
  const [packages, setPackages] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'form' | 'package'>('form');
  
  // Custom option states
  const [showCustomMetPersonRole, setShowCustomMetPersonRole] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Audio recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);

  // Video recording
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [mediaRecorderVideo, setMediaRecorderVideo] = useState<MediaRecorder | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);

  const [cameraField, setCameraField] = useState<string | null>(null);

  useEffect(() => {
    // جلب الباقات
    const token = localStorage.getItem('token');
    fetch(`${import.meta.env.VITE_API_URL}/api/packages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPackages(data.data || []))
      .catch(() => setPackages([]));
  }, []);

  // Function to start the camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera if available
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraStream(stream);
      setShowCamera(true);
    } catch (err) {
      alert('تعذر الوصول إلى الكاميرا');
      console.error('Camera error:', err);
    }
  };

  // Function to stop the camera
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  };

  // Function to capture photo
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
            const file = new File([blob], `signature_${Date.now()}.jpg`, { type: 'image/jpeg' });
            setForm(prev => ({ ...prev, signature_image: file }));
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  // تحديث الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === 'file' && files) {
      setForm(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'met_person_role') {
      // Check if this is coming from the select dropdown
      if (e.target.tagName === 'SELECT') {
        if (value === 'custom') {
          setShowCustomMetPersonRole(true);
          setForm(prev => ({ ...prev, [name]: '' }));
        } else {
          setShowCustomMetPersonRole(false);
          setForm(prev => ({ ...prev, [name]: value }));
        }
      } else {
        // This is coming from the custom input field
        setForm(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  // جلب الموقع الجغرافي
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setForm(prev => ({ ...prev, gps_latitude: String(pos.coords.latitude), gps_longitude: String(pos.coords.longitude) }));
          setLocationCaptured(true);
        },
        err => alert('تعذر الحصول على الموقع الجغرافي')
      );
    } else {
      alert('المتصفح لا يدعم تحديد الموقع');
    }
  };

  // Start audio recording
  const handleStartAudioRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('جهازك لا يدعم تسجيل الصوت مباشرة');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setRecordingAudio(true);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedAudioURL(URL.createObjectURL(blob));
        setForm(prev => ({ ...prev, audio_recording: new File([blob], 'recorded_audio.webm', { type: 'audio/webm' }) }));
        setRecordingAudio(false);
      };
      recorder.start();
    } catch {
      alert('تعذر بدء تسجيل الصوت');
    }
  };

  // Stop audio recording
  const handleStopAudioRecording = () => {
    if (mediaRecorder && recordingAudio) {
      mediaRecorder.stop();
      setRecordingAudio(false);
    }
  };

  // Start video recording
  const handleStartVideoRecording = async () => {
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert('جهازك لا يدعم تسجيل الفيديو مباشرة');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setVideoStream(stream);
      const recorder = new MediaRecorder(stream);
      setMediaRecorderVideo(recorder);
      setRecordingVideo(true);
      const chunks: BlobPart[] = [];
      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        setRecordedVideoURL(URL.createObjectURL(blob));
        setForm(prev => ({ ...prev, video_recording: new File([blob], 'recorded_video.webm', { type: 'video/webm' }) }));
        setRecordingVideo(false);
        if (videoStream) {
          videoStream.getTracks().forEach(track => track.stop());
          setVideoStream(null);
        }
      };
      recorder.start();
    } catch {
      alert('تعذر بدء تسجيل الفيديو');
    }
  };

  // Stop video recording
  const handleStopVideoRecording = () => {
    if (mediaRecorderVideo && recordingVideo) {
      mediaRecorderVideo.stop();
      setRecordingVideo(false);
    }
  };

  // عند الضغط على التالي انتقل لاختيار الباقة
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form, delivery_service_requested: form.delivery_service_requested === 'true' ? true : form.delivery_service_requested === 'false' ? false : undefined };
    setStep('package');
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

  return (
    <div className="min-h-screen bg-[#F5F5F5] py-6 px-4 sm:py-8 md:py-10" dir="rtl">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-green text-center mb-4">تسجيل تفاصيل الزيارة</h2>
        
        {/* Merchant Info Card */}
        <div className="bg-[#FFF8E7] rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gold text-xl">🏢</span>
                <span className="font-bold text-[#0F4C5C]">اسم التاجر:</span>
                <span className="text-gray-800">{merchant.commercial_name || merchant.name || ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-xl">📧</span>
                <span className="font-bold text-[#0F4C5C]">البريد الإلكتروني:</span>
                <span className="text-gray-800">{merchant.email || ''}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-gold text-xl">📱</span>
                <span className="font-bold text-[#0F4C5C]">رقم الجوال:</span>
                <span className="text-gray-800">{merchant.mobile || merchant.phone || ''}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gold text-xl">🏪</span>
                <span className="font-bold text-[#0F4C5C]">الفرع:</span>
                <span className="text-gray-800">{branch?.name || ''} - {branch?.city || ''} {branch?.district ? `- ${branch.district}` : ''}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">✅</div>
              <div className="mr-3">
                <p className="text-green-800">تم حفظ تفاصيل الزيارة بنجاح</p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">⚠️</div>
              <div className="mr-3">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-2xl shadow-lg">
          {step === 'form' ? (
            <form className="p-4 sm:p-6 md:p-8" onSubmit={handleNext} encType="multipart/form-data">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الزيارة *</label>
                    <input 
                      type="date" 
                      name="visit_date" 
                      value={form.visit_date} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all" 
                      required 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">اسم المسؤل الدي قابلته</label>
                    <input 
                      type="text" 
                      name="met_person_name" 
                      value={form.met_person_name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all" 
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">دور المسؤول</label>
                    <select 
                      name="met_person_role" 
                      value={form.met_person_role} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    >
                      <option value="">اختر</option>
                      <option value="owner">مالك</option>
                      <option value="manager">مدير</option>
                      <option value="custom">اختيار آخر</option>
                    </select>
                    {showCustomMetPersonRole && (
                      <input 
                        type="text" 
                        name="met_person_role" 
                        value={form.met_person_role} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-gold focus:border-transparent transition-all" 
                        placeholder="اكتب دور المسؤول المخصص..."
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">طلب خدمه تصوير</label>
                    <select 
                      name="delivery_service_requested" 
                      value={form.delivery_service_requested} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    >
                      <option value="">اختر</option>
                      <option value="true">نعم</option>
                      <option value="false">لا</option>
                    </select>
                  </div>
                </div>

                {/* Visit Status and Rating */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">حالة الزيارة *</label>
                    <select 
                      name="visit_status" 
                      value={form.visit_status} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all" 
                      required
                    >
                      <option value="">اختر</option>
                      <option value="visited">تمت الزيارة</option>
                      <option value="closed">المحل مغلق</option>
                      <option value="not_found">غير موجود</option>
                      <option value="refused">رفض الزيارة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">تقييم التاجر *</label>
                    <select 
                      name="vendor_rating" 
                      value={form.vendor_rating} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all" 
                      required
                    >
                      <option value="">اختر</option>
                      <option value="very_interested">مهتم جداً</option>
                      <option value="hesitant">متردد</option>
                      <option value="refused">رافض</option>
                      <option value="inappropriate">غير مناسب</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات عامة</label>
                    <textarea 
                      name="notes" 
                      value={form.notes} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all min-h-[100px]" 
                    />
                  </div>
                </div>
              </div>

              {/* Media Section */}
              <div className="mt-8 space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-brand-green mb-4">الوسائط المتعددة</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Audio Recording */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">تسجيل صوتي</label>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <input 
                          type="file" 
                          name="audio_recording" 
                          accept="audio/*" 
                          onChange={handleChange} 
                          className="w-full mb-2" 
                        />
                        <div className="flex gap-2">
                          {!recordingAudio ? (
                            <button 
                              type="button" 
                              onClick={handleStartAudioRecording} 
                              className="flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#0A3641] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              <span className="text-lg">🎤</span>
                              تسجيل صوت
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={handleStopAudioRecording} 
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              <span className="text-lg">⬤</span>
                              إيقاف التسجيل
                            </button>
                          )}
                        </div>
                        {recordedAudioURL && (
                          <div className="mt-2">
                            <audio controls src={recordedAudioURL} className="w-full" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Video Recording */}
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700">تسجيل فيديو</label>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <input 
                          type="file" 
                          name="video_recording" 
                          accept="video/*" 
                          onChange={handleChange} 
                          className="w-full mb-2" 
                        />
                        <div className="flex gap-2">
                          {!recordingVideo ? (
                            <button 
                              type="button" 
                              onClick={handleStartVideoRecording} 
                              className="flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#0A3641] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              <span className="text-lg">🎥</span>
                              تسجيل فيديو
                            </button>
                          ) : (
                            <button 
                              type="button" 
                              onClick={handleStopVideoRecording} 
                              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                            >
                              <span className="text-lg">⬤</span>
                              إيقاف التسجيل
                            </button>
                          )}
                        </div>
                        {recordedVideoURL && (
                          <div className="mt-2">
                            <video controls src={recordedVideoURL} className="w-full max-h-[200px] rounded-lg" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-brand-green mb-4">الملاحظات</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات المندوب</label>
                      <textarea 
                        name="agent_notes" 
                        value={form.agent_notes} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all min-h-[100px]" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات داخلية</label>
                      <textarea 
                        name="internal_notes" 
                        value={form.internal_notes} 
                        onChange={handleChange} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all min-h-[100px]" 
                      />
                    </div>
                  </div>
                </div>

                {/* Signature and Location */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-brand-green mb-4">التوقيع والموقع</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">توقيع العميل</label>
                      <div className="relative">
                        <input
                          type="file"
                          name="signature_image"
                          accept="image/jpg,image/jpeg,image/png"
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-all pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => handleCameraCapture('signature_image')}
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#0F4C5C] hover:text-[#0A3641] transition-colors text-2xl"
                          title="التقاط صورة بالكاميرا"
                        >
                          📷
                        </button>
                      </div>
                      {form.signature_image && (
                        <div className="mt-2 text-sm text-green-600">✓ تم اختيار التوقيع</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">الموقع الجغرافي</label>
                      <button 
                        type="button" 
                        onClick={handleGetLocation} 
                        className="flex items-center gap-2 bg-[#0F4C5C] hover:bg-[#0A3641] text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors w-auto"
                      >
                        <span className="text-lg">📍</span>
                        تحديد الموقع الحالي
                      </button>
                      {locationCaptured && (
                        <div className="text-sm text-green-600 mt-1">✓ تم تحديد الموقع</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button 
                  type="submit" 
                  className="w-full bg-[#D4AF37] hover:bg-[#B39030] text-white py-3 px-4 rounded-lg font-bold transition-colors" 
                  disabled={loading}
                >
                  {loading ? 'جاري الحفظ...' : 'التالي'}
                </button>
              </div>
            </form>
          ) : (
            <PackageSelection form={form} merchant={merchant} branch={branch} />
          )}
        </div>
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

export default VisitReport;
