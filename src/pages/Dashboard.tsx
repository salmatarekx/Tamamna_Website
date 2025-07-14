import React from 'react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="p-4 max-w-4xl mx-auto mt-8" dir="rtl">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-2xl font-bold text-brand-green mb-1">مرحباً بك في جولد ستيشن</h4>
            <p className="text-brand-green">الصفحه الرئيسية</p>
          </div>
          
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center">
          <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gold text-xl">👥</span>
          </div>
          <h5 className="text-xl font-bold text-brand-green mb-1">150</h5>
          <small className="text-brand-green">إجمالي التجار</small>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center">
          <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gold text-xl">✅</span>
          </div>
          <h5 className="text-xl font-bold text-brand-green mb-1">45</h5>
          <small className="text-brand-green">زيارات اليوم</small>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center">
          <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gold text-xl">📈</span>
          </div>
          <h5 className="text-xl font-bold text-brand-green mb-1">85%</h5>
          <small className="text-brand-green">معدل النجاح</small>
        </div>
        <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4 text-center">
          <div className="w-12 h-12 bg-gold-light rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-gold text-xl">⭐</span>
          </div>
          <h5 className="text-xl font-bold text-brand-green mb-1">4.7</h5>
          <small className="text-brand-green">متوسط التقييم</small>
        </div>
      </div>


      {/* آخر الزيارات */}
      <div className="mb-6">
        <h6 className="text-lg font-semibold text-brand-green mb-4">آخر الزيارات</h6>
        <div className="space-y-3">
          <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="font-medium text-brand-green mb-1">متجر الأنوار</h6>
                <small className="text-brand-green">منذ ساعتين</small>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">مكتملة</span>
            </div>
          </div>
          <div className="bg-brand-white rounded-lg shadow-md border border-gold p-4">
            <div className="flex justify-between items-center">
              <div>
                <h6 className="font-medium text-brand-green mb-1">مؤسسة الرياض</h6>
                <small className="text-brand-green">منذ 4 ساعات</small>
              </div>
              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">قيد المراجعة</span>
            </div>
          </div>
        </div>
      </div>
      {/* دعم ومساعدة */}
      <section id="support" className="mt-12 bg-brand-white rounded-lg shadow-md border border-gold p-6 text-center max-w-xl mx-auto">
        <h6 className="text-lg font-semibold text-gold mb-2 flex items-center justify-center gap-2">
        <span>الدعم و المساعده</span>
        </h6>
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="flex items-center gap-2 text-brand-green text-base">
            <span className="bg-gold-light text-gold rounded-full p-2 flex items-center justify-center">
              {/* Headphone icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 18v-6a9 9 0 0118 0v6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 18a3 3 0 01-6 0v-3a3 3 0 016 0v3zM3 18a3 3 0 006 0v-3a3 3 0 00-6 0v3z" /></svg>
            </span>
            <span>اتصل بنا هاتفياً:</span>
            <a href="tel:966500000000" className="text-gold font-bold underline">+966 50 000 0000</a>
          </div>
        </div>
        <div className="my-2 text-brand-green font-semibold text-base flex items-center justify-center">
          <span>أو</span>
        </div>
        <p className="text-brand-green mb-4 text-sm">يمكنك التواصل مع الدعم عن طريق إرسال رسالة إلى البريد الإلكتروني. ستترد عليك خلال 24 ساعة.</p>
        <form onSubmit={e => { e.preventDefault(); /* handle send */ }} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="أرسل سؤالك هنا"
            className="border border-gray-200 rounded px-3 py-2 text-right focus:outline-none focus:border-teal-500 text-sm"
            dir="rtl"
            required
          />
          <button type="submit" className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded transition-colors">
            <span>إرسال</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m0 0l4-4m-4 4l4 4" /><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </button>
        </form>
      </section>
    </div>
  );
};

export default Dashboard;
