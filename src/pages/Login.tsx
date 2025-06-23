
import React from 'react';
import './Login.css';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="login-screen" id="login-screen">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="text-center mt-5">
              <div className="logo-container mb-4">
                <img 
                  src="/tmmna-logo.png" 
                  alt="TMMNA Logo" 
                  className="logo-image"
                  style={{ maxWidth: '200px', height: 'auto' }}
                />
              </div>
              <h2 className="text-navy mb-4">مرحباً بك في تممنا</h2>
            </div>

            <form className="px-3">
              <div className="mb-3">
                <label className="form-label">اسم المستخدم</label>
                <input type="text" className="form-control" placeholder="أدخل اسم المستخدم" />
              </div>
              
              <div className="mb-3">
                <label className="form-label">كلمة المرور</label>
                <input type="password" className="form-control" placeholder="أدخل كلمة المرور" />
              </div>
              
              <div className="text-center mb-3">
                <a href="#" className="text-teal text-decoration-none">نسيت كلمة المرور؟</a>
              </div>
              
              <button 
                type="button" 
                className="btn btn-teal w-100 mb-3"
                onClick={onLogin}
              >
                تسجيل الدخول
              </button>
              
              <div className="text-center text-muted mb-3">أو</div>
              
              <div className="d-grid gap-2">
                <button type="button" className="btn btn-outline-danger">
                  <i className="fab fa-google me-2"></i>
                  الدخول بـ Google
                </button>
                <button type="button" className="btn btn-outline-dark">
                  <i className="fab fa-apple me-2"></i>
                  الدخول بـ Apple
                </button>
                <button type="button" className="btn btn-outline-primary">
                  <i className="fab fa-facebook me-2"></i>
                  الدخول بـ Facebook
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
