import React, { useEffect, useState } from 'react';

interface Agent {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

interface AgentDetailsResponse {
  agent: Agent;
  branches: any[]; // Keep for compatibility but won't use
  visits: any[]; // Keep for compatibility but won't use
}

const UserProfileInfo: React.FC = () => {
  const [data, setData] = useState<AgentDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const { agent } = data;

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
    </div>
  );
};

export default UserProfileInfo; 