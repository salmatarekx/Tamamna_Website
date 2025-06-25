import React, { useState, useEffect } from 'react';
import Logo1 from '../assets/Logo1.png';

const GoogleIcon = () => (
  <svg className="inline-block mr-2 align-middle" width="20" height="20" viewBox="0 0 48 48"><g><path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.7 33.1 30.1 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.3-4z"/><path fill="#34A853" d="M6.3 14.7l7 5.1C15.5 16.1 19.4 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.3 5.1 29.4 3 24 3 15.1 3 7.6 8.7 6.3 14.7z"/><path fill="#FBBC05" d="M24 45c5.4 0 10.3-1.8 14.1-4.9l-6.5-5.3C29.6 36.7 26.9 37.5 24 37.5c-6.1 0-10.7-4.1-12.5-9.6l-7 5.4C7.6 39.3 15.1 45 24 45z"/><path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-2.2 0-4.2-.7-5.7-2l-7 5.4C15.1 39.3 19.4 45 24 45c10.5 0 20-7.5 20-21 0-1.3-.1-2.7-.3-4z"/></g></svg>
);

const AppleIcon = () => (
  <svg className="inline-block mr-2 align-middle" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M16.365 1.43c0 1.14-.93 2.07-2.07 2.07-.04 0-.08 0-.12-.01-.02-.04-.03-.09-.03-.14 0-1.13.93-2.06 2.07-2.06.04 0 .08 0 .12.01.02.04.03.09.03.13zm2.52 4.36c-1.34-.02-2.47.77-3.12.77-.66 0-1.68-.75-2.77-.73-1.42.02-2.74.83-3.47 2.11-1.48 2.56-.38 6.36 1.06 8.45.7 1.01 1.53 2.14 2.62 2.1 1.06-.04 1.46-.68 2.74-.68 1.28 0 1.64.68 2.76.66 1.14-.02 1.85-1.03 2.54-2.05.8-1.18 1.13-2.33 1.15-2.39-.03-.01-2.2-.84-2.23-3.33-.02-2.08 1.7-3.07 1.78-3.12-1-.46-2.04-.47-2.29-.47zm-2.41-4.36c.02 0 .04 0 .06.01.02.04.03.09.03.13 0 1.13-.93 2.06-2.07 2.06-.04 0-.08 0-.12-.01-.02-.04-.03-.09-.03-.13 0-1.13.93-2.06 2.07-2.06zm-2.46 21.1c-.02 0-.04 0-.06-.01-.02-.04-.03-.09-.03-.13 0-1.13.93-2.06 2.07-2.06.04 0 .08 0 .12.01.02.04.03.09.03.13 0 1.13-.93 2.06-2.07 2.06z"/></svg>
);

const FacebookIcon = () => (
  <svg className="inline-block mr-2 align-middle" width="20" height="20" viewBox="0 0 24 24"><path fill="#1877F3" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 10.995 10.125 11.854v-8.385H7.078v-3.47h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.513c-1.491 0-1.953.926-1.953 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.068 24 18.092 24 12.073z"/></svg>
);

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  
  useEffect(() => {
    // Hide TopBar when Login component mounts
    const topBar = document.querySelector('header');
    if (topBar) {
      topBar.style.display = 'none';
    }
    
    // Show TopBar when Login component unmounts
    return () => {
      if (topBar) {
        topBar.style.display = 'flex';
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 md:p-8" dir="rtl">
      <div className="w-full max-w-md md:max-w-lg bg-white md:rounded-2xl shadow-lg md:shadow-xl p-4 sm:p-8 md:p-10">
        <div className="text-center mb-8">
          <div className="mb-6">
            <img
              src={Logo1}
              alt="TMMNA Logo"
              className="mx-auto rounded-2xl shadow-lg"
              style={{ width: '128px', height: '128px', objectFit: 'contain' }}
            />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">مرحباً بك في تممنا</h2>
          <p className="text-gray-600 text-base md:text-lg">تسجيل الدخول إلى حسابك</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">اسم المستخدم</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base md:text-lg"
              style={{ backgroundColor: '#d6f1e9' }}
              placeholder="أدخل اسم المستخدم" 
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">كلمة المرور</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-100 text-base md:text-lg"
              placeholder="أدخل كلمة المرور" 
            />
          </div>
          
          <div className="text-center">
            <a href="#" className="text-sm font-bold text-teal-600 hover:text-teal-500">نسيت كلمة المرور؟</a>
          </div>
          
          <button 
            type="button" 
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-full hover:bg-teal-700 transition-colors duration-200 text-base md:text-lg"
            onClick={() => onLogin(username)}
          >
            تسجيل الدخول
          </button>
          
          <div className="text-center text-gray-500 text-sm">أو</div>
          
          <div className="space-y-3">
            <button type="button" className="w-full border border-red-500 text-red-500 py-2 px-4 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200 text-base md:text-lg">
              <GoogleIcon />الدخول بـ Google
            </button>
            <button type="button" className="w-full border border-gray-800 text-gray-800 py-2 px-4 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-200 text-base md:text-lg">
              <AppleIcon />الدخول بـ Apple
            </button>
            <button type="button" className="w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-full hover:bg-blue-600 hover:text-white transition-colors duration-200 text-base md:text-lg">
              <FacebookIcon />الدخول بـ Facebook
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
