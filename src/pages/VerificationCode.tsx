import React, { useState, useRef, useEffect } from 'react';
import SocialIcon from '@/assets/social.png';
import { useNavigate } from 'react-router-dom';

const VerificationCode: React.FC = () => {
  const [code, setCode] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(167); // 2:47 in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (val: string, idx: number) => {
    if (!/^[0-9]?$/.test(val)) return;
    const newCode = [...code];
    newCode[idx] = val;
    setCode(newCode);
    if (val && idx < 3) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(167);
    setCode(['', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const minutes = String(Math.floor(timer / 60)).padStart(1, '0');
  const seconds = String(timer % 60).padStart(2, '0');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] py-8 px-2 sm:px-4" dir="rtl">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="flex flex-col items-center px-2 sm:px-4">
          <div className="mb-4 mt-2">
            <img src={SocialIcon} alt="Social Icon" className="w-32 h-32 object-contain mx-auto" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0C2240] mb-4">تم إرسال</h2>
          <p className="text-[#0C2240] text-center text-sm sm:text-base mb-6">
            تم إرسال رابط الدفع إلى واتساب الخاص بك. بعد إتمام الدفع، ستصلك رسالة تحتوي على رمز التحقق. يرجى إدخال الرمز أدناه لإكمال الاشتراك.
          </p>
          <div className="flex justify-center mb-6 w-full">
            <div className="flex justify-center items-center gap-3 border-2 border-gold rounded-xl px-4 py-4 bg-brand-white mx-auto" style={{maxWidth: '220px'}}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="w-10 h-12 text-center text-xl font-bold text-[#0C2240] border border-[#1C8C81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1C8C81] focus:border-[#1C8C81] transition-all"
                  value={digit}
                  onChange={e => handleCodeChange(e.target.value, idx)}
                  onKeyDown={e => handleKeyDown(e, idx)}
                />
              ))}
            </div>
          </div>
          <div className="text-[#0C2240] text-lg sm:text-xl font-bold mb-2">{minutes}:{seconds}</div>
          <div className="mb-6">
            <button
              type="button"
              className={`text-[#0CA1A2] underline text-base font-medium hover:text-[#0FA697] ${timer > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleResend}
            >
              لم يصلك الرمز؟ أعد الإرسال
            </button>
          </div>
          <button
            className="w-full bg-gold text-brand-black py-3 rounded-xl text-base sm:text-lg font-bold hover:bg-gold-dark hover:text-brand-white transition-colors duration-200"
            onClick={() => navigate('/subscription-confirmation')}
          >
            تأكيد الرمز
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationCode; 