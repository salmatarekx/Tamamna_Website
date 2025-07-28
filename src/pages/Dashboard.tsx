import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [summary, setSummary] = useState<any>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('agent_token');
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/home/summary`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        setError('فشل في جلب البيانات');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center text-brand-green">جاري تحميل البيانات...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto mt-8" dir="rtl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-2xl font-bold text-brand-green mb-1">مرحباً بك {summary?.agent?.details?.name ? `، ${summary.agent.details.name}` : ''}</h4>
            <p className="text-brand-green">الصفحة الرئيسية</p>
          </div>
        </div>
      </div>

      {/* كل الإحصائيات في صف واحد */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-8">
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">👥</span>
          <span className="text-xl font-bold text-brand-green">{summary?.vendor_count ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">عدد التجار</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">🏢</span>
          <span className="text-xl font-bold text-brand-green">{summary?.branch_count ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">عدد الفروع</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">⭐</span>
          <span className="text-xl font-bold text-brand-green">{summary?.avg_vendor_rating ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">متوسط تقييم التجار</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">✅</span>
          <span className="text-xl font-bold text-brand-green">{summary?.visits_today ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">زيارات اليوم</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">📅</span>
          <span className="text-xl font-bold text-brand-green">{summary?.agent?.visits_month ?? summary?.agent?.monthly_visits?.count ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">زيارات الشهر</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">🏬</span>
          <span className="text-xl font-bold text-brand-green">{summary?.agent?.branches_count ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">فروع المندوب</span>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center flex flex-col items-center">
          <span className="text-gold text-2xl mb-1">📝</span>
          <span className="text-xl font-bold text-brand-green">{summary?.agent?.visits_count ?? '-'}</span>
          <span className="text-xs text-brand-green mt-1">زيارات المندوب</span>
        </div>
      </div>

      {/* بيانات آخر تاجر */}
      <div className="mb-8">
        <h6 className="text-lg font-semibold text-brand-green mb-4">أحدث تاجر</h6>
        {summary?.latest_vendor ? (
          <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="font-bold text-xl text-gold mb-2">{summary.latest_vendor.commercial_name || summary.latest_vendor.owner_name}</div>
              <div className="text-brand-green mb-1">رقم السجل التجاري: {summary.latest_vendor.commercial_registration_number}</div>
              <div className="text-brand-green mb-1">الجوال: {summary.latest_vendor.mobile}</div>
              <div className="text-brand-green mb-1">المدينة: {summary.latest_vendor.city} - {summary.latest_vendor.district}</div>
              <div className="text-brand-green mb-1">البريد الإلكتروني: {summary.latest_vendor.email}</div>
              <div className="text-brand-green mb-1">نوع النشاط: {summary.latest_vendor.activity_type}</div>
              <div className="text-brand-green mb-1">تاريخ الإنشاء: {summary.latest_vendor.created_at?.split('T')[0]}</div>
              <div className="text-brand-green mb-1">ملاحظات: {summary.latest_vendor.notes}</div>
            </div>
          </div>
        ) : <div className="text-gray-500">لا يوجد بيانات تاجر حديثة</div>}
      </div>

      {/* أحدث الفروع */}
      <div className="mb-8">
        <h6 className="text-lg font-semibold text-brand-green mb-4">أحدث الفروع</h6>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {summary?.latest_branches?.map((branch: any) => (
            <div
              key={branch.id}
              className="bg-brand-white rounded-lg shadow-md border border-gold p-4 cursor-pointer hover:bg-gold-light transition"
              onClick={() => navigate(`/merchant/${branch.vendor_id}`)}
            >
              <div className="font-bold text-lg text-gold mb-1">{branch.name}</div>
              <div className="text-brand-green mb-1">المدينة: {branch.city} - {branch.district}</div>
              <div className="text-brand-green mb-1">الجوال: {branch.mobile}</div>
              <div className="text-brand-green mb-1">العنوان: {branch.address}</div>
              <div className="text-brand-green mb-1">تاريخ الإنشاء: {branch.created_at?.split('T')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      {/* بيانات المندوب */}
      <div className="mb-8">
        <h6 className="text-lg font-semibold text-brand-green mb-4">بيانات المندوب</h6>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1">
            <div className="font-bold text-lg text-gold mb-1">{summary?.agent?.details?.name}</div>
            <div className="text-brand-green mb-1">البريد الإلكتروني: {summary?.agent?.details?.email}</div>
            <div className="text-brand-green mb-1">عدد الفروع: {summary?.agent?.branches_count}</div>
            <div className="text-brand-green mb-1">عدد الزيارات: {summary?.agent?.visits_count}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
