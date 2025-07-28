import React, { useEffect, useState } from 'react';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface Vendor {
  id: number;
  owner_name: string;
  commercial_name: string;
  commercial_registration_number?: string;
  mobile?: string;
  whatsapp?: string;
  snapchat?: string;
  instagram?: string;
  email?: string;
  city?: string;
  district?: string;
  activity_type?: string;
  activity_start_date?: string;
  has_commercial_registration?: string;
  has_online_platform?: boolean | number;
  previous_platform_experience?: string;
  previous_platform_issues?: string;
  has_product_photos?: boolean | number;
  notes?: string;
}

interface Branch {
  id: number;
  name: string;
  mobile?: string;
  email?: string;
  address?: string;
  location_url?: string;
  city?: string;
  district?: string;
  created_at?: string;
  vendor?: Vendor;
}

interface AgentDetailsResponse {
  agent: Agent;
  branches: Branch[];
  visits: any[]; // Keep for compatibility but won't use
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

const UserProfileInfo: React.FC = () => {
  const [data, setData] = useState<AgentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [branchSearch, setBranchSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/agent/details`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('فشل في جلب البيانات');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-brand-green">جاري تحميل البيانات...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!data) return null;

  const { agent, branches } = data;

  // Filter branches
  const filteredBranches = branches.filter(branch => {
    const search = branchSearch.trim().toLowerCase();
    if (!search) return true;
    return (
      (branch.name && branch.name.toLowerCase().includes(search)) ||
      (branch.vendor && branch.vendor.commercial_name && branch.vendor.commercial_name.toLowerCase().includes(search)) ||
      (branch.vendor && branch.vendor.owner_name && branch.vendor.owner_name.toLowerCase().includes(search))
    );
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-brand-white rounded-2xl mt-10 shadow" dir="rtl">
      {/* Agent Info */}
      <h2 className="text-2xl font-bold text-gold mb-6 text-center">الملف الشخصي</h2>
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex flex-col items-center gap-2 mb-4">
          <span className="text-6xl bg-gold-light rounded-full w-24 h-24 flex items-center justify-center shadow">👤</span>
          <div className="text-xl font-bold text-brand-green mt-2">{agent?.name}</div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-gold text-xl">📧</span>
            <span className="font-bold text-brand-green">البريد الإلكتروني:</span>
            <span className="text-brand-green">{agent?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold text-xl">📱</span>
            <span className="font-bold text-brand-green">رقم الجوال:</span>
            <span className="text-brand-green">{agent?.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gold text-xl">🗓️</span>
            <span className="font-bold text-brand-green">تاريخ الإنشاء:</span>
            <span className="text-brand-green">{agent?.created_at?.split('T')[0]}</span>
          </div>
        </div>
      </div>

      {/* Branches Section */}
      <div className="bg-brand-white rounded-2xl shadow-lg p-6 mb-8">
        {/* Search Box - Above the title */}
        <div className="mb-6">
          <input
            type="text"
            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors shadow-sm"
            placeholder="ابحث في الفروع أو اسم التاجر..."
            value={branchSearch}
            onChange={e => setBranchSearch(e.target.value)}
          />
        </div>

        {/* Title */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gold flex items-center gap-3">
            <span className="text-3xl">🏢</span>
            الفروع المرتبطة 
            <span className="text-brand-green text-xl">({branches.length})</span>
          </h3>
        </div>
        
        <div className="space-y-4">
          {filteredBranches.length > 0 ? filteredBranches.map((branch) => (
            <div key={branch.id} className="bg-gradient-to-r from-gray-50 to-white border-2 border-gold-light rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-gold">
              {/* Branch Header */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-xl text-white">🏪</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-brand-green">{branch.name}</h4>
                    <p className="text-sm text-gray-500">رقم الفرع: {branch.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">تاريخ الإنشاء</div>
                  <div className="font-medium text-brand-green">{formatDate(branch.created_at)}</div>
                </div>
              </div>

              {/* Branch Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">📱</span>
                    <span className="font-medium text-brand-green">الجوال:</span>
                    <span className="text-gray-700">{branch.mobile || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">📧</span>
                    <span className="font-medium text-brand-green">البريد الإلكتروني:</span>
                    <span className="text-gray-700">{branch.email || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">📍</span>
                    <span className="font-medium text-brand-green">العنوان:</span>
                    <span className="text-gray-700">{branch.address || 'غير متوفر'}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">🏙️</span>
                    <span className="font-medium text-brand-green">المدينة:</span>
                    <span className="text-gray-700">{branch.city || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">🏘️</span>
                    <span className="font-medium text-brand-green">الحي:</span>
                    <span className="text-gray-700">{branch.district || 'غير متوفر'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">🗺️</span>
                    <span className="font-medium text-brand-green">رابط الموقع:</span>
                    {branch.location_url ? (
                      <a href={branch.location_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">عرض الخريطة</a>
                    ) : (
                      <span className="text-gray-700">غير متوفر</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              {branch.vendor && (
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-gold text-xl">👤</span>
                    <h5 className="font-bold text-brand-green">بيانات التاجر المرتبط</h5>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">اسم المالك:</span>
                      <span className="text-gray-700">{branch.vendor.owner_name || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">الاسم التجاري:</span>
                      <span className="text-gray-700">{branch.vendor.commercial_name || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">رقم السجل التجاري:</span>
                      <span className="text-gray-700">{branch.vendor.commercial_registration_number || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">الجوال:</span>
                      <span className="text-gray-700">{branch.vendor.mobile || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">واتساب:</span>
                      <span className="text-gray-700">{branch.vendor.whatsapp || 'غير متوفر'}</span>
                    </div>
                    {branch.vendor.snapchat && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">سناب شات:</span>
                        <span className="text-gray-700">{branch.vendor.snapchat}</span>
                      </div>
                    )}
                    {branch.vendor.instagram && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">انستجرام:</span>
                        <span className="text-gray-700">{branch.vendor.instagram}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">البريد الإلكتروني:</span>
                      <span className="text-gray-700">{branch.vendor.email || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">المدينة:</span>
                      <span className="text-gray-700">{branch.vendor.city || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">الحي:</span>
                      <span className="text-gray-700">{branch.vendor.district || 'غير متوفر'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-brand-green">نوع النشاط:</span>
                      <span className="text-gray-700">{branch.vendor.activity_type || 'غير متوفر'}</span>
                    </div>
                    {branch.vendor.activity_start_date && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">تاريخ بدء النشاط:</span>
                        <span className="text-gray-700">{formatDate(branch.vendor.activity_start_date)}</span>
                      </div>
                    )}
                    {branch.vendor.has_commercial_registration && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">يوجد سجل تجاري:</span>
                        <span className="text-gray-700">{branch.vendor.has_commercial_registration === 'yes' ? 'نعم' : 'لا'}</span>
                      </div>
                    )}
                    {typeof branch.vendor.has_online_platform !== 'undefined' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">يوجد منصة إلكترونية:</span>
                        <span className="text-gray-700">{branch.vendor.has_online_platform ? 'نعم' : 'لا'}</span>
                      </div>
                    )}
                    {branch.vendor.previous_platform_experience && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">خبرة سابقة بالمنصات:</span>
                        <span className="text-gray-700">{branch.vendor.previous_platform_experience}</span>
                      </div>
                    )}
                    {branch.vendor.previous_platform_issues && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">مشاكل سابقة:</span>
                        <span className="text-gray-700">{branch.vendor.previous_platform_issues}</span>
                      </div>
                    )}
                    {typeof branch.vendor.has_product_photos !== 'undefined' && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">يوجد صور منتجات:</span>
                        <span className="text-gray-700">{branch.vendor.has_product_photos ? 'نعم' : 'لا'}</span>
                      </div>
                    )}
                    {branch.vendor.notes && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-brand-green">ملاحظات:</span>
                        <span className="text-gray-700">{branch.vendor.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-brand-green mb-2">لا يوجد فروع مطابقة</h3>
              <p className="text-gray-500">جرب تغيير كلمات البحث أو تحقق من البيانات المتاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileInfo; 