import React, { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from '../components/ui/dropdown-menu';
import { useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../lib/utils';

interface MerchantDetailProps {
  onNavigate: (screen: string) => void;
}

const activityOptions = [
  { value: 'تجارة التجزئة', label: 'تجارة التجزئة' },
  { value: 'تجارة الجملة', label: 'تجارة الجملة' },
  { value: 'خدمات', label: 'خدمات' },
  { value: 'تصنيع', label: 'تصنيع' },
];

const MerchantDetail: React.FC<MerchantDetailProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedActivity, setSelectedActivity] = useState(activityOptions[0].value);
  const [merchant, setMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const selectedBranch = merchant && merchant.branches && merchant.branches.find((b: any) => String(b.id) === selectedBranchId);

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    setLoading(true);
    fetch(`${API_URL}/api/vendors/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMerchant(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        setError('فشل في جلب بيانات التاجر');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">جاري التحميل...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!merchant) return <div className="p-4">لا توجد بيانات لهذا التاجر</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto" dir="rtl">
      <div className="flex items-center mb-6">
        <button 
          className="p-2 mr-3 text-gold-dark hover:text-gold transition-colors duration-200"
          onClick={() => onNavigate('merchants')}
        >
          <span className="text-xl">←</span>
        </button>
        <h5 className="text-xl font-semibold text-brand-green">تفاصيل التاجر</h5>
      </div>
      <form className="space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">اسم المنشأة</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.commercial_name || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">اسم المالك</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.owner_name || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">رقم السجل التجاري</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.commercial_registration_number || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">رقم الجوال</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.mobile || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">البريد الإلكتروني</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.email || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">المدينة</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.city || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">الحي</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.district || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">نوع النشاط التجاري</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.activity_type || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">تاريخ بداية النشاط</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.activity_start_date ? merchant.activity_start_date.split('T')[0] : 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">واتساب</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.whatsapp || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">انستغرام</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.instagram || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">سناب شات</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.snapchat || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">رابط الموقع الجغرافي</label>
            {merchant.location_url ? (
              <a href={merchant.location_url} target="_blank" rel="noopener noreferrer" className="block w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-blue-600 font-bold">رابط</a>
            ) : (
              <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value="غير متوفر" readOnly />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">ملاحظات</label>
            <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value={merchant.notes || 'غير متوفر'} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">صورة السجل التجاري</label>
            <div className="field">
              {merchant.commercial_registration_image ? (
                <img src={merchant.commercial_registration_image} alt="صورة السجل التجاري" style={{maxWidth: '200px'}} />
              ) : <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value="غير متوفر" readOnly />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">صورة واجهة المحل</label>
            <div className="field">
              {merchant.shop_front_image ? (
                <img src={merchant.shop_front_image} alt="واجهة المحل" style={{maxWidth: '200px'}} />
              ) : <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value="غير متوفر" readOnly />}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-green mb-2">الفروع</label>
            <div className="field">
              {merchant.branches && merchant.branches.length > 0 ? (
                <select
                  className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold mb-2"
                  value={selectedBranchId || ''}
                  onChange={e => setSelectedBranchId(e.target.value)}
                >
                  <option value="">اختر فرعاً</option>
                  {merchant.branches.map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name || 'غير متوفر'}</option>
                  ))}
                </select>
              ) : <input type="text" className="w-full px-3 py-2 border border-gold rounded-lg bg-gold-light text-brand-green font-bold" value="غير متوفر" readOnly />}
            </div>
          </div>
        </div>
        <div className="space-y-3 pt-4">
          <button 
            type="button" 
            className="w-full bg-gold text-brand-black py-3 px-4 rounded-lg hover:bg-gold-dark hover:text-brand-white transition-colors duration-200"
            onClick={() => {
              if (!selectedBranch) {
                alert('يرجى اختيار فرع أولاً');
                return;
              }
              navigate('/visitreport', { state: { merchant, branch: selectedBranch } });
            }}
          >
            انشاء زياره
          </button>
          <button 
            type="button" 
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors duration-200"
            onClick={() => navigate('/add-branch', { state: { vendor: { id: merchant.id, idOrCR: merchant.idOrCR || merchant.id, tradeName: merchant.commercial_name || merchant.tradeName } } })}
          >
            إضافة فرع جديد
          </button>
          <button 
            type="button" 
            className="w-full border border-gold text-brand-green py-3 px-4 rounded-lg hover:bg-gold-light transition-colors duration-200"
            onClick={() => onNavigate('merchants')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default MerchantDetail;
