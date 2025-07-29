import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Props {
  form: Record<string, unknown>;
  merchant: Record<string, unknown>;
  branch: Record<string, unknown>;
}

const PackageSelection: React.FC<Props> = ({ form, merchant, branch }) => {
  const [packages, setPackages] = useState<Record<string, unknown>[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    fetch(`${import.meta.env.VITE_API_URL}/api/packages`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setPackages(data.data || []))
      .catch(() => setPackages([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const token = localStorage.getItem('agent_token');
    const formData = new FormData();
    
    // Process form data with proper type checking
    Object.entries({ ...form, package_id: selected }).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (
          key === 'audio_recording' ||
          key === 'video_recording' ||
          key === 'signature_image'
        ) {
          // Proper type checking for File objects
          if (value && typeof value === 'object' && value !== null && 'size' in value && 'type' in value) {
            formData.append(key, value as File);
          }
        } else if (key === 'delivery_service_requested') {
          // Handle boolean conversion properly
          const boolValue = String(value).toLowerCase();
          if (boolValue === 'true') {
            formData.append(key, '1');
          } else {
            formData.append(key, '0');
          }
        } else {
          // Convert all other values to string
          formData.append(key, String(value));
        }
      }
    });

    // Handle met_person_role and custom_role logic
    const metPersonRole = form.met_person_role;
    
    if (metPersonRole && typeof metPersonRole === 'string') {
      if (metPersonRole === 'owner' || metPersonRole === 'manager') {
        // Send predefined roles as is
        formData.append('met_person_role', metPersonRole);
      } else {
        // For any other value, treat it as a custom role
        formData.append('met_person_role', 'other');
        formData.append('custom_role', metPersonRole);
      }
    }

    // Validate required fields before submission
    if (!selected) {
      setError('الرجاء اختيار باقة');
      setLoading(false);
      return;
    }

    try {
      // Log form data for debugging
      console.log('Submitting form data:', Object.fromEntries(formData.entries()));

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendor-visits`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });
      
      // Log the raw response for debugging
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok || res.status === 201) {
        if (data.success === false) {
          // Handle case where response is OK but operation failed
          setError(data.message || 'فشل في حفظ تفاصيل الزيارة');
        } else {
          setShowSnackbar(true);
          setTimeout(() => {
            setShowSnackbar(false);
            navigate('/dashboard');
          }, 2000);
        }
      } else {
        // Handle different types of errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join(', ');
          setError(errorMessages);
        } else if (data.message) {
          setError(data.message);
        } else if (res.status === 401) {
          setError('انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('agent_token');
          navigate('/login');
        } else {
          setError('فشل في حفظ تفاصيل الزيارة');
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showSnackbar && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-bold text-lg animate-fade-in">
          تمت الزيارة بنجاح
        </div>
      )}
      <h3 className="text-lg font-bold mb-4 text-teal-700">اختر الباقة المناسبة</h3>
      {error && <div className="mb-4 p-2 bg-red-100 text-red-800 text-center rounded">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="space-y-3 mb-4">
          {packages.map(pkg => {
            const isBest = pkg.name === 'Premium Package' || pkg.name === 'Enterprise Package' || pkg.price === Math.max(...packages.map(p => Number(p.price)));
            return (
              <label
                key={pkg.id as string | number}
                className={`block border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 shadow-sm relative ${selected === String(pkg.id) ? 'border-teal-600 bg-gold-light shadow-lg' : 'border-gray-200 bg-white'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="package"
                      value={pkg.id as string}
                      checked={selected === String(pkg.id)}
                      onChange={() => setSelected(String(pkg.id))}
                      className="mr-2 accent-teal-600"
                    />
                    <span className="font-bold text-lg">{pkg.name as string}</span>
                  </div>
                  {isBest && (
                    <span className="bg-teal-600 text-white text-xs px-3 py-1 rounded-full font-bold ml-2">الأفضل</span>
                  )}
                </div>
                <div className="text-gray-700 mb-1">{pkg.description as string}</div>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-1">
                  {pkg.duration_in_days && <span>المدة: {pkg.duration_in_days as string} يوم</span>}
                  {pkg.product_limit && <span>حد المنتجات: {pkg.product_limit as string}</span>}
                  {typeof pkg.is_active !== 'undefined' && <span>الحالة: {Number(pkg.is_active) === 1 ? 'مفعلة' : 'غير مفعلة'}</span>}
                  {pkg.created_at && <span>تاريخ الإنشاء: {(pkg.created_at as string).split('T')[0]}</span>}
                </div>
                <div className="text-blue-700 font-bold text-lg">{pkg.price as string} ريال</div>
              </label>
            );
          })}
        </div>
        <button type="submit" className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors duration-200" disabled={loading || !selected}>
          {loading ? 'جاري الحفظ...' : 'تأكيد الاشتراك'}
        </button>
      </form>
    </div>
  );
};

export default PackageSelection; 