import React, { useState } from 'react';

const UserProfileInfo: React.FC = () => {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [address, setAddress] = useState('');

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => setProfilePic(ev.target?.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    alert('تم حفظ المعلومات بنجاح!');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-brand-white rounded-2xl mt-10" dir="rtl">
      <h2 className="text-2xl font-bold text-gold mb-6 text-center">المعلومات الشخصية</h2>
      <form onSubmit={handleSave} className="space-y-6">
        {/* صورة الملف الشخصي */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-24 h-24 mb-2">
            <label htmlFor="profilePic" className="cursor-pointer absolute inset-0">
              <div className="w-24 h-24 rounded-full bg-gold flex items-center justify-center overflow-hidden border-4 border-brand-white shadow">
                {profilePic ? (
                  <img src={profilePic} alt="صورة الملف الشخصي" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-4xl text-brand-white">👤</span>
                )}
              </div>
            </label>
            <input id="profilePic" type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
            <button
              type="button"
              onClick={() => document.getElementById('profilePic')?.click()}
              className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-gold-dark hover:bg-gold text-brand-white text-2xl shadow focus:outline-none border-2 border-brand-white"
              aria-label="إضافة أو تغيير الصورة"
            >
              ✎
            </button>
          </div>
        </div>
        {/* الاسم الكامل */}
        <div>
          <label className="block font-bold text-brand-green mb-1">الاسم الكامل</label>
          <input type="text" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={fullName} onChange={e => setFullName(e.target.value)} required />
        </div>
        {/* اسم المستخدم */}
        <div>
          <label className="block font-bold text-brand-green mb-1">اسم المستخدم</label>
          <input type="text" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        
        {/* تاريخ الميلاد */}
        <div>
          <label className="block font-bold text-brand-green mb-1">تاريخ الميلاد (اختياري)</label>
          <input type="date" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        </div>
        <div className="h-0.5 bg-gold-dark rounded my-6" />
        <h3 className="text-xl font-bold text-gold mt-8 mb-4 text-center">معلومات الاتصال</h3>
        {/* البريد الإلكتروني */}
        <div>
          <label className="block font-bold text-brand-green mb-1">البريد الإلكتروني</label>
          <input type="email" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        {/* رقم الهاتف المحمول */}
        <div>
          <label className="block font-bold text-brand-green mb-1">رقم الهاتف المحمول</label>
          <input type="tel" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={phone} onChange={e => setPhone(e.target.value)} required />
        </div>
        {/* رقم واتساب */}
        <div>
          <label className="block font-bold text-brand-green mb-1">رقم واتساب</label>
          <input type="tel" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
        </div>
        <div className="h-0.5 bg-gold-dark rounded my-6" />
        <h3 className="text-xl font-bold text-gold mt-8 mb-4 text-center">الوسائط الاجتماعية والروابط (اختياري)</h3>
        {/* الموقع الإلكتروني */}
        <div>
          <label className="block font-bold text-brand-green mb-1">الموقع الإلكتروني</label>
          <input type="url" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={website} onChange={e => setWebsite(e.target.value)} />
        </div>
        {/* إنستاجرام */}
        <div>
          <label className="block font-bold text-brand-green mb-1">إنستاجرام</label>
          <input type="text" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={instagram} onChange={e => setInstagram(e.target.value)} />
        </div>
        {/* تويتر */}
        <div>
          <label className="block font-bold text-brand-green mb-1">تويتر</label>
          <input type="text" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={twitter} onChange={e => setTwitter(e.target.value)} />
        </div>
        {/* العنوان */}
        <div>
          <label className="block font-bold text-brand-green mb-1">العنوان (الشارع، المدينة، الولاية/المحافظة، الرمز البريدي)</label>
          <input type="text" className="w-full border border-gold rounded-lg px-3 py-2 focus:outline-none focus:border-gold bg-gray-100 text-brand-green font-bold placeholder-gold-dark transition" value={address} onChange={e => setAddress(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-brand-white font-bold py-3 rounded-lg transition-colors mt-6 shadow">حفظ المعلومات</button>
      </form>
    </div>
  );
};

export default UserProfileInfo; 