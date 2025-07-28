import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PackageSelection from './PackageSelection';

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

  // Audio recording
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);

  // Video recording
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [mediaRecorderVideo, setMediaRecorderVideo] = useState<MediaRecorder | null>(null);
  const [recordingVideo, setRecordingVideo] = useState(false);
  const [recordedVideoURL, setRecordedVideoURL] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-8 px-2 sm:px-4" dir="rtl">
      <h2 className="text-2xl font-semibold text-gray-900 text-center my-8">تسجيل تفاصيل الزيارة</h2>
      <div className="bg-white shadow-md w-full max-w-md mx-auto p-4 sm:p-6">
        {/* عرض بيانات التاجر والفرع */}
        <div className="mb-4 p-2 bg-gold-light rounded text-brand-green font-bold text-center">
          <div>اسم التاجر: {merchant.commercial_name || merchant.name || ''}</div>
          <div>البريد الإلكتروني: {merchant.email || ''}</div>
          <div>رقم الجوال: {merchant.mobile || merchant.phone || ''}</div>
          <div>الفرع: {branch?.name || ''} - {branch?.city || ''} {branch?.district ? `- ${branch.district}` : ''}</div>
        </div>
        {success && <div className="mb-4 p-2 bg-green-100 text-green-800 text-center rounded">تم حفظ تفاصيل الزيارة بنجاح</div>}
        {error && <div className="mb-4 p-2 bg-red-100 text-red-800 text-center rounded">{error}</div>}
        {step === 'form' && (
        <form className="space-y-4" onSubmit={handleNext} encType="multipart/form-data">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تاريخ الزيارة</label>
            <input type="date" name="visit_date" value={form.visit_date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المسؤل الدي قابلته</label>
            <input type="text" name="met_person_name" value={form.met_person_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">دور المسؤول</label>
            <select name="met_person_role" value={form.met_person_role} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
              <option value="">اختر</option>
              <option value="owner">مالك</option>
              <option value="manager">مدير</option>
              <option value="custom">اختيار آخر</option>
            </select>
            {showCustomMetPersonRole && (
              <div className="mt-2">
                <input 
                  type="text" 
                  name="met_person_role" 
                  value={form.met_person_role} 
                  onChange={handleChange} 
                  className="w-full px-3 py-2 border rounded-lg" 
                  placeholder="اكتب دور المسؤول المخصص..."
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">طلب خدمه تصوير</label>
            <select name="delivery_service_requested" value={form.delivery_service_requested} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg">
              <option value="">اختر</option>
              <option value="true">نعم</option>
              <option value="false">لا</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات عامة</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">حالة الزيارة</label>
            <select name="visit_status" value={form.visit_status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">اختر</option>
              <option value="visited">تمت الزيارة</option>
              <option value="closed">المحل مغلق</option>
              <option value="not_found">غير موجود</option>
              <option value="refused">رفض الزيارة</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تقييم التاجر</label>
            <select name="vendor_rating" value={form.vendor_rating} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" required>
              <option value="">اختر</option>
              <option value="very_interested">مهتم جداً</option>
              <option value="hesitant">متردد</option>
              <option value="refused">رافض</option>
              <option value="inappropriate">غير مناسب</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تسجيل صوتي (mp3, wav, max 10MB)</label>
            <input type="file" name="audio_recording" accept="audio/*" onChange={handleChange} className="w-full" />
            {form.audio_recording && (
              <div className="text-xs text-green-700 mt-1">تم اختيار ملف: {form.audio_recording instanceof File ? form.audio_recording.name : ''}</div>
            )}
            <div className="flex gap-2 mt-2">
              {!recordingAudio && (
                <button type="button" onClick={handleStartAudioRecording} className="bg-gold text-brand-black px-3 py-1 rounded font-bold">تسجيل صوت</button>
              )}
              {recordingAudio && (
                <button type="button" onClick={handleStopAudioRecording} className="bg-red-500 text-white px-3 py-1 rounded font-bold">إيقاف التسجيل</button>
              )}
              {recordedAudioURL && (
                <audio controls src={recordedAudioURL} className="mt-2" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">تسجيل فيديو (mp4, avi, mov, max 20MB)</label>
            <input type="file" name="video_recording" accept="video/*" onChange={handleChange} className="w-full" />
            {form.video_recording && (
              <div className="text-xs text-green-700 mt-1">تم اختيار ملف: {form.video_recording instanceof File ? form.video_recording.name : ''}</div>
            )}
            <div className="flex gap-2 mt-2">
              {!recordingVideo && (
                <button type="button" onClick={handleStartVideoRecording} className="bg-gold text-brand-black px-3 py-1 rounded font-bold">تسجيل فيديو</button>
              )}
              {recordingVideo && (
                <button type="button" onClick={handleStopVideoRecording} className="bg-red-500 text-white px-3 py-1 rounded font-bold">إيقاف التسجيل</button>
              )}
              {recordedVideoURL && (
                <video controls src={recordedVideoURL} className="mt-2 max-h-40" />
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات المندوب</label>
            <textarea name="agent_notes" value={form.agent_notes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">ملاحظات داخلية</label>
            <textarea name="internal_notes" value={form.internal_notes} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">توقيع العميل (jpg, jpeg, png, max 5MB)</label>
            <input type="file" name="signature_image" accept="image/jpg,image/jpeg,image/png" onChange={handleChange} className="w-full" />
          </div>
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <button type="button" onClick={handleGetLocation} className="w-full bg-gold text-brand-black px-3 py-2 rounded-lg font-bold hover:bg-gold-dark transition-colors">تحديد الموقع الحالي</button>
              {locationCaptured && (
                <div className="mt-2 text-sm text-green-600">✓ تم تحديد الموقع</div>
              )}
            </div>
          </div>
          <button type="submit" className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200" disabled={loading}>{loading ? 'جاري الحفظ...' : 'التالي'}</button>
        </form>
        )}
        {step === 'package' && (
          <PackageSelection form={form} merchant={merchant} branch={branch} />
        )}
      </div>
    </div>
  );
};

export default VisitReport;
