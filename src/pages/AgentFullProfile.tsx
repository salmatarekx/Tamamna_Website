import React, { useEffect, useState } from 'react';

// TypeScript interfaces for API data
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

// تحويل التاريخ لصيغة عربية مختصرة
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function AgentFullProfile() {
  const [data, setData] = useState<AgentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('agent_token');
        if (!token) {
          setError('لم يتم العثور على التوكن. الرجاء تسجيل الدخول.');
          setLoading(false);
          return;
        }
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/agent/details`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (!res.ok) {
          throw new Error('فشل في جلب البيانات من الخادم');
        }
        const json = await res.json();
        console.log('API response:', json); // Debug: log API response
        setData(json);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'حدث خطأ غير متوقع');
        } else {
          setError('حدث خطأ غير متوقع');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div dir="rtl" style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#fafafa', minHeight: '100vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>جاري التحميل...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div dir="rtl" style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#fafafa', minHeight: '100vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        <span>{error}</span>
      </div>
    );
  }

  if (!data) return (
    <div dir="rtl" style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#fafafa', minHeight: '100vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
      <span>لم يتم استلام بيانات من الخادم.</span>
    </div>
  );

  const { agent, branches, visits } = data;

  if (!agent) {
    return (
      <div dir="rtl" style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#fafafa', minHeight: '100vh', padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'red' }}>
        <span>لا توجد بيانات للمندوب.</span>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ fontFamily: 'Tajawal, Arial, sans-serif', background: '#fafafa', minHeight: '100vh', padding: 24 }}>
      {/* بيانات المندوب */}
      <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>بيانات المندوب</h2>
        <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
          <div><b>الاسم:</b> {agent?.name}</div>
          <div><b>البريد الإلكتروني:</b> {agent?.email}</div>
          <div><b>الجوال:</b> {agent?.phone}</div>
          <div><b>تاريخ الإنشاء:</b> {formatDate(agent?.created_at)}</div>
        </div>
      </section>

      {/* الفروع والتجار */}
      <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24, marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          الفروع والتجار المرتبطين <span style={{ color: '#888', fontSize: 18 }}>({branches ? branches.length : 0})</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {branches && branches.length > 0 ? branches.map((branch) => (
            <div key={branch.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>فرع: {branch.name}</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <div><b>الجوال:</b> {branch.mobile}</div>
                <div><b>البريد الإلكتروني:</b> {branch.email}</div>
                <div><b>العنوان:</b> {branch.address}</div>
                <div><b>المدينة:</b> {branch.city}</div>
                <div><b>الحي:</b> {branch.district}</div>
                <div><b>رابط الموقع:</b> <a href={branch.location_url} target="_blank" rel="noopener noreferrer">خريطة</a></div>
                <div><b>تاريخ الإنشاء:</b> {branch.created_at ? formatDate(branch.created_at) : ''}</div>
              </div>
              {branch.vendor && (
                <div style={{ background: '#f7f7f7', borderRadius: 6, padding: 12, marginTop: 8 }}>
                  <div style={{ fontWeight: 500, marginBottom: 4 }}>بيانات التاجر المرتبط:</div>
                  <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
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
          )) : <div style={{ color: '#888', textAlign: 'center', margin: '24px 0' }}>لا يوجد فروع مرتبطة.</div>}
        </div>
      </section>

      {/* زيارات المندوب */}
      <section style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #0001', padding: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
          زيارات المندوب <span style={{ color: '#888', fontSize: 18 }}>({visits ? visits.length : 0})</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {visits && visits.length > 0 ? visits.map((visit) => (
            <div key={visit.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>تاريخ الزيارة: {formatDate(visit.visit_date)}</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 8 }}>
                <div><b>ملاحظات:</b> {visit.notes}</div>
                <div><b>حالة الزيارة:</b> {visit.visit_status}</div>
                <div><b>تقييم التاجر:</b> {visit.vendor_rating}</div>
                <div><b>ملاحظات المندوب:</b> {visit.agent_notes}</div>
                <div><b>ملاحظات داخلية:</b> {visit.internal_notes}</div>
                <div><b>توقيع:</b> {visit.signature_image && <a href={visit.signature_image} target="_blank" rel="noopener noreferrer">رابط التوقيع</a>}</div>
                <div><b>إحداثيات GPS:</b> {visit.gps_latitude}, {visit.gps_longitude}</div>
              </div>
              <div style={{ background: '#f7f7f7', borderRadius: 6, padding: 12, marginTop: 8 }}>
                {visit.vendor && (
                  <>
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>بيانات التاجر:</div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      <div><b>الاسم التجاري:</b> {visit.vendor.commercial_name}</div>
                      <div><b>اسم المالك:</b> {visit.vendor.owner_name}</div>
                    </div>
                  </>
                )}
                {visit.branch && (
                  <>
                    <div style={{ fontWeight: 500, margin: '12px 0 4px' }}>بيانات الفرع:</div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      <div><b>اسم الفرع:</b> {visit.branch.name}</div>
                    </div>
                  </>
                )}
                {visit.package && (
                  <>
                    <div style={{ fontWeight: 500, margin: '12px 0 4px' }}>بيانات البكج:</div>
                    <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                      <div><b>اسم البكج:</b> {visit.package.name}</div>
                      <div><b>الوصف:</b> {visit.package.description}</div>
                      <div><b>السعر:</b> {visit.package.price} ريال</div>
                      {visit.package.product_limit && <div><b>حد المنتجات:</b> {visit.package.product_limit}</div>}
                      {visit.package.duration_in_days && <div><b>المدة (يوم):</b> {visit.package.duration_in_days}</div>}
                    </div>
                  </>
                )}
              </div>
            </div>
          )) : <div style={{ color: '#888', textAlign: 'center', margin: '24px 0' }}>لا يوجد زيارات.</div>}
        </div>
      </section>
    </div>
  );
} 