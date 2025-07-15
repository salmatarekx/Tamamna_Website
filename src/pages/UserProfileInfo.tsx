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

interface Package {
  id?: number;
  name: string;
  description?: string;
  price?: string;
  product_limit?: number;
  duration_in_days?: number;
}

interface Visit {
  id: number;
  visit_date: string;
  notes?: string;
  visit_status?: string;
  vendor_rating?: string;
  agent_notes?: string;
  internal_notes?: string;
  signature_image?: string;
  gps_latitude?: string;
  gps_longitude?: string;
  package?: Package;
  vendor?: Partial<Vendor>;
  branch?: Partial<Branch>;
}

interface AgentDetailsResponse {
  agent: Agent;
  branches: Branch[];
  visits: Visit[];
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
  const [visitSearch, setVisitSearch] = useState('');

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

  const { agent, branches, visits } = data;

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

  // Filter visits
  const filteredVisits = visits.filter(visit => {
    const search = visitSearch.trim().toLowerCase();
    if (!search) return true;
    return (
      (visit.notes && visit.notes.toLowerCase().includes(search)) ||
      (visit.vendor && visit.vendor.commercial_name && visit.vendor.commercial_name.toLowerCase().includes(search)) ||
      (visit.vendor && visit.vendor.owner_name && visit.vendor.owner_name.toLowerCase().includes(search)) ||
      (visit.branch && visit.branch.name && visit.branch.name.toLowerCase().includes(search))
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
      <h3 className="text-xl font-bold text-gold mb-4">الفروع المرتبطة ({branches.length})</h3>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-gold"
        placeholder="ابحث في الفروع أو اسم التاجر..."
        value={branchSearch}
        onChange={e => setBranchSearch(e.target.value)}
      />
      <div className="flex flex-col gap-6 mb-8">
        {filteredBranches.length > 0 ? filteredBranches.map((branch) => (
          <div key={branch.id} className="border rounded-xl p-4 bg-gray-50">
            <div className="font-bold text-brand-green mb-2">فرع: {branch.name}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><b>الجوال:</b> {branch.mobile}</div>
              <div><b>البريد الإلكتروني:</b> {branch.email}</div>
              <div><b>العنوان:</b> {branch.address}</div>
              <div><b>المدينة:</b> {branch.city}</div>
              <div><b>الحي:</b> {branch.district}</div>
              <div><b>رابط الموقع:</b> {branch.location_url && <a href={branch.location_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">خريطة</a>}</div>
              <div><b>تاريخ الإنشاء:</b> {formatDate(branch.created_at)}</div>
            </div>
            {branch.vendor && (
              <div className="bg-white rounded-lg p-3 mt-2 border">
                <div className="font-bold mb-1">بيانات التاجر المرتبط:</div>
                <div className="flex flex-wrap gap-4">
                  <div><b>اسم المالك:</b> {branch.vendor.owner_name}</div>
                  <div><b>الاسم التجاري:</b> {branch.vendor.commercial_name}</div>
                  <div><b>رقم السجل التجاري:</b> {branch.vendor.commercial_registration_number}</div>
                  <div><b>الجوال:</b> {branch.vendor.mobile}</div>
                  <div><b>واتساب:</b> {branch.vendor.whatsapp}</div>
                  {branch.vendor.snapchat && <div><b>سناب شات:</b> {branch.vendor.snapchat}</div>}
                  {branch.vendor.instagram && <div><b>انستجرام:</b> {branch.vendor.instagram}</div>}
                  <div><b>البريد الإلكتروني:</b> {branch.vendor.email}</div>
                  <div><b>المدينة:</b> {branch.vendor.city}</div>
                  <div><b>الحي:</b> {branch.vendor.district}</div>
                  <div><b>نوع النشاط:</b> {branch.vendor.activity_type}</div>
                  {branch.vendor.activity_start_date && <div><b>تاريخ بدء النشاط:</b> {formatDate(branch.vendor.activity_start_date)}</div>}
                  {branch.vendor.has_commercial_registration && <div><b>يوجد سجل تجاري:</b> {branch.vendor.has_commercial_registration === 'yes' ? 'نعم' : 'لا'}</div>}
                  {typeof branch.vendor.has_online_platform !== 'undefined' && <div><b>يوجد منصة إلكترونية:</b> {branch.vendor.has_online_platform ? 'نعم' : 'لا'}</div>}
                  {branch.vendor.previous_platform_experience && <div><b>خبرة سابقة بالمنصات:</b> {branch.vendor.previous_platform_experience}</div>}
                  {branch.vendor.previous_platform_issues && <div><b>مشاكل سابقة:</b> {branch.vendor.previous_platform_issues}</div>}
                  {typeof branch.vendor.has_product_photos !== 'undefined' && <div><b>يوجد صور منتجات:</b> {branch.vendor.has_product_photos ? 'نعم' : 'لا'}</div>}
                  {branch.vendor.notes && <div><b>ملاحظات:</b> {branch.vendor.notes}</div>}
                </div>
              </div>
            )}
          </div>
        )) : <div className="text-gray-500 text-center">لا يوجد فروع مطابقة.</div>}
      </div>

      {/* Visits Section */}
      <h3 className="text-xl font-bold text-gold mb-4">زيارات المندوب ({visits.length})</h3>
      <input
        type="text"
        className="w-full mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-gold"
        placeholder="ابحث في الزيارات أو اسم التاجر أو الفرع..."
        value={visitSearch}
        onChange={e => setVisitSearch(e.target.value)}
      />
      <div className="flex flex-col gap-6">
        {filteredVisits.length > 0 ? filteredVisits.map((visit) => (
          <div key={visit.id} className="border rounded-xl p-4 bg-gray-50">
            <div className="font-bold text-brand-green mb-2">تاريخ الزيارة: {formatDate(visit.visit_date)}</div>
            <div className="flex flex-wrap gap-4 mb-2">
              <div><b>ملاحظات:</b> {visit.notes}</div>
              <div><b>حالة الزيارة:</b> {visit.visit_status}</div>
              <div><b>تقييم التاجر:</b> {visit.vendor_rating}</div>
              <div><b>ملاحظات المندوب:</b> {visit.agent_notes}</div>
              <div><b>ملاحظات داخلية:</b> {visit.internal_notes}</div>
              <div><b>توقيع:</b> {visit.signature_image && <a href={visit.signature_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">رابط التوقيع</a>}</div>
              <div><b>إحداثيات GPS:</b> {visit.gps_latitude}, {visit.gps_longitude}</div>
            </div>
            {visit.vendor && (
              <div className="bg-white rounded-lg p-3 mt-2 border">
                <div className="font-bold mb-1">بيانات التاجر:</div>
                <div className="flex flex-wrap gap-4">
                  <div><b>الاسم التجاري:</b> {visit.vendor.commercial_name}</div>
                  <div><b>اسم المالك:</b> {visit.vendor.owner_name}</div>
                </div>
              </div>
            )}
            {visit.branch && (
              <div className="bg-white rounded-lg p-3 mt-2 border">
                <div className="font-bold mb-1">بيانات الفرع:</div>
                <div className="flex flex-wrap gap-4">
                  <div><b>اسم الفرع:</b> {visit.branch.name}</div>
                </div>
              </div>
            )}
            {visit.package && (
              <div className="bg-white rounded-lg p-3 mt-2 border">
                <div className="font-bold mb-1">بيانات البكج:</div>
                <div className="flex flex-wrap gap-4">
                  <div><b>اسم البكج:</b> {visit.package.name}</div>
                  <div><b>الوصف:</b> {visit.package.description}</div>
                  <div><b>السعر:</b> {visit.package.price} ريال</div>
                  {visit.package.product_limit && <div><b>حد المنتجات:</b> {visit.package.product_limit}</div>}
                  {visit.package.duration_in_days && <div><b>المدة (يوم):</b> {visit.package.duration_in_days}</div>}
                </div>
              </div>
            )}
          </div>
        )) : <div className="text-gray-500 text-center">لا يوجد زيارات مطابقة.</div>}
      </div>
    </div>
  );
};

export default UserProfileInfo; 