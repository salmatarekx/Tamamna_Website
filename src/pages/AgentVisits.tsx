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

// Utility to map visit status to Arabic
function getStatusArabic(status: string | undefined | null) {
  switch ((status || '').toLowerCase()) {
    case 'visited': return 'تمت الزيارة';
    case 'closed': return 'مغلقة';
    case 'not_found': return 'غير متوفر';
    case 'refused': return 'مرفوضة';
    case '':
    case null:
    case undefined:
      return 'غير محدد';
    default: return status ? status : 'غير محدد';
  }
}

// Utility to get color classes for each status
function getStatusColorClasses(status: string | undefined | null) {
  switch ((status || '').toLowerCase()) {
    case 'visited': return 'bg-green-100 text-green-800';
    case 'closed': return 'bg-gray-200 text-gray-800';
    case 'not_found': return 'bg-yellow-100 text-yellow-800';
    case 'refused': return 'bg-red-100 text-red-800';
    case '':
    case null:
    case undefined:
      return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

const AgentVisits: React.FC = () => {
  const [data, setData] = useState<AgentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
        <p className="text-brand-green text-lg">جاري تحميل زيارات المندوب...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    </div>
  );
  
  if (!data) return null;

  const { agent, visits } = data;

  // Filter visits
  const filteredVisits = visits.filter(visit => {
    const search = visitSearch.trim().toLowerCase();
    if (!search) return true;
    
    // Search in commercial name
    const commercialName = visit.vendor?.commercial_name?.toLowerCase() || '';
    if (commercialName.includes(search)) return true;
    
    // Search in city (vendor city or branch city)
    const vendorCity = visit.vendor?.city?.toLowerCase() || '';
    const branchCity = visit.branch?.city?.toLowerCase() || '';
    if (vendorCity.includes(search) || branchCity.includes(search)) return true;
    
    // Search in date
    const visitDate = formatDate(visit.visit_date).toLowerCase();
    if (visitDate.includes(search)) return true;
    
    // Search in notes (keep existing functionality)
    const notes = visit.notes?.toLowerCase() || '';
    if (notes.includes(search)) return true;
    
    // Search in owner name (keep existing functionality)
    const ownerName = visit.vendor?.owner_name?.toLowerCase() || '';
    if (ownerName.includes(search)) return true;
    
    // Search in branch name (keep existing functionality)
    const branchName = visit.branch?.name?.toLowerCase() || '';
    if (branchName.includes(search)) return true;
    
    return false;
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="max-w-6xl mx-auto p-4 pt-20">
        {/* Header */}
        <div className="bg-brand-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center">
                <span className="text-3xl text-white">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-brand-green">زيارات المندوب</h1>
                <p className="text-gold font-medium">{agent?.name}</p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold">{visits.length}</div>
              <div className="text-sm text-brand-green">إجمالي الزيارات</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-brand-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="relative">
            <input
              type="text"
              className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gold transition-colors"
              placeholder="ابحث بالاسم التجاري أو المدينة أو التاريخ..."
              value={visitSearch}
              onChange={e => setVisitSearch(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          </div>
        </div>

        {/* Visits List */}
        <div className="space-y-4">
          {filteredVisits.length > 0 ? filteredVisits.map((visit) => (
            <div key={visit.id} className="bg-brand-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              {/* Visit Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-brand-green">زيارة بتاريخ {formatDate(visit.visit_date)}</h3>
                    <p className="text-sm text-gray-500">رقم الزيارة: {visit.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClasses(visit.visit_status)}`}>
                    {getStatusArabic(visit.visit_status)}
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">📝</span>
                    <div>
                      <div className="font-medium text-brand-green">ملاحظات الزيارة</div>
                      <div className="text-sm text-gray-600">{visit.notes || 'لا توجد ملاحظات'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">⭐</span>
                    <div>
                      <div className="font-medium text-brand-green">تقييم التاجر</div>
                      <div className="text-sm text-gray-600">{visit.vendor_rating || 'غير محدد'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">💬</span>
                    <div>
                      <div className="font-medium text-brand-green">ملاحظات المندوب</div>
                      <div className="text-sm text-gray-600">{visit.agent_notes || 'لا توجد ملاحظات'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">🔒</span>
                    <div>
                      <div className="font-medium text-brand-green">ملاحظات داخلية</div>
                      <div className="text-sm text-gray-600">{visit.internal_notes || 'لا توجد ملاحظات'}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">📍</span>
                    <div>
                      <div className="font-medium text-brand-green">إحداثيات GPS</div>
                      <div className="text-sm text-gray-600">
                        {visit.gps_latitude && visit.gps_longitude ? 
                          `${visit.gps_latitude}, ${visit.gps_longitude}` : 
                          'غير محدد'
                        }
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gold text-lg">✍️</span>
                    <div>
                      <div className="font-medium text-brand-green">التوقيع</div>
                      <div className="text-sm text-gray-600">
                        {visit.signature_image ? 
                          <a href={visit.signature_image} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">عرض التوقيع</a> : 
                          'غير متوفر'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              {visit.vendor && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-brand-green mb-3 flex items-center gap-2">
                    <span className="text-gold">🏢</span>
                    بيانات التاجر
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="font-medium text-brand-green">الاسم التجاري:</span> {visit.vendor.commercial_name}</div>
                    <div><span className="font-medium text-brand-green">اسم المالك:</span> {visit.vendor.owner_name}</div>
                  </div>
                </div>
              )}

              {/* Branch Information */}
              {visit.branch && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <h4 className="font-bold text-brand-green mb-3 flex items-center gap-2">
                    <span className="text-gold">🏪</span>
                    بيانات الفرع
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="font-medium text-brand-green">اسم الفرع:</span> {visit.branch.name}</div>
                    {visit.branch.city && <div><span className="font-medium text-brand-green">المدينة:</span> {visit.branch.city}</div>}
                    {visit.branch.district && <div><span className="font-medium text-brand-green">الحي:</span> {visit.branch.district}</div>}
                  </div>
                </div>
              )}

              {/* Package Information */}
              {visit.package && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-bold text-brand-green mb-3 flex items-center gap-2">
                    <span className="text-gold">📦</span>
                    بيانات البكج
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><span className="font-medium text-brand-green">اسم البكج:</span> {visit.package.name}</div>
                    {visit.package.description && <div><span className="font-medium text-brand-green">الوصف:</span> {visit.package.description}</div>}
                    {visit.package.price && <div><span className="font-medium text-brand-green">السعر:</span> {visit.package.price} ريال</div>}
                    {visit.package.product_limit && <div><span className="font-medium text-brand-green">حد المنتجات:</span> {visit.package.product_limit}</div>}
                    {visit.package.duration_in_days && <div><span className="font-medium text-brand-green">المدة:</span> {visit.package.duration_in_days} يوم</div>}
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className="bg-brand-white rounded-2xl shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-brand-green mb-2">لا توجد زيارات مطابقة</h3>
              <p className="text-gray-500">جرب تغيير كلمات البحث أو تحقق من البيانات المتاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentVisits; 