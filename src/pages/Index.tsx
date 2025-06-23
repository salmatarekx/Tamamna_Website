
import React, { useState } from 'react';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [rating, setRating] = useState(0);

  const screens = {
    login: 'تسجيل الدخول',
    merchants: 'قائمة التجار',
    merchantDetail: 'تفاصيل التاجر',
    visitReport: 'تقرير الزيارة',
    packages: 'اختيار الباقة'
  };

  const packages = [
    { id: 'basic', name: 'الباقة الأساسية', price: '100 ر.س / شهر', icon: 'fas fa-box' },
    { id: 'standard', name: 'الباقة المعيارية', price: '200 ر.س / شهر', icon: 'fas fa-boxes' },
    { id: 'premium', name: 'الباقة المتقدمة', price: '300 ر.س / شهر', icon: 'fas fa-crown' },
    { id: 'enterprise', name: 'باقة المؤسسات', price: '500 ر.س / شهر', icon: 'fas fa-building' }
  ];

  const merchants = [
    { id: 1, name: 'متجر الأنوار', phone: '0501234567', rating: 4.5 },
    { id: 2, name: 'مؤسسة الرياض التجارية', phone: '0507654321', rating: 4.2 },
    { id: 3, name: 'شركة الخليج للتجارة', phone: '0509876543', rating: 4.8 }
  ];

  const renderStars = (ratingValue, isClickable = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <i
        key={star}
        className={`fas fa-star rating-stars ${star <= ratingValue ? 'text-warning' : 'text-muted'}`}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={isClickable ? () => setRating(star) : undefined}
      />
    ));
  };

  const LoginScreen = () => (
    <div className="screen active" id="login-screen">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="text-center mt-5">
              <div className="logo">
                TMMNA
              </div>
              <h2 className="text-navy mb-4">مرحباً بك</h2>
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
                onClick={() => setCurrentScreen('merchants')}
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

  const MerchantsScreen = () => (
    <div className="container-fluid p-3">
      <div className="mb-3">
        <div className="input-group">
          <input 
            type="text" 
            className="form-control" 
            placeholder="ابحث عن تاجر..."
          />
          <span className="input-group-text">
            <i className="fas fa-search"></i>
          </span>
        </div>
      </div>
      
      <div className="merchants-list">
        {merchants.map(merchant => (
          <div 
            key={merchant.id} 
            className="merchant-card p-3"
            onClick={() => setCurrentScreen('merchantDetail')}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">{merchant.name}</h6>
                <p className="text-muted mb-1">
                  <i className="fas fa-phone me-1"></i>
                  {merchant.phone}
                </p>
                <div className="d-flex align-items-center">
                  {renderStars(merchant.rating)}
                  <span className="ms-2 text-muted">{merchant.rating}</span>
                </div>
              </div>
              <i className="fas fa-chevron-left text-muted"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const MerchantDetailScreen = () => (
    <div className="container-fluid p-3">
      <div className="d-flex align-items-center mb-3">
        <button 
          className="btn btn-link p-0 me-3"
          onClick={() => setCurrentScreen('merchants')}
        >
          <i className="fas fa-arrow-right text-navy"></i>
        </button>
        <h5 className="mb-0">تفاصيل التاجر</h5>
      </div>
      
      <form>
        <div className="mb-3">
          <label className="form-label">اسم المنشأة</label>
          <input type="text" className="form-control" defaultValue="متجر الأنوار" />
        </div>
        
        <div className="mb-3">
          <label className="form-label">رقم الهوية</label>
          <input type="text" className="form-control" defaultValue="1234567890" />
        </div>
        
        <div className="mb-3">
          <label className="form-label">رقم الهاتف</label>
          <input type="tel" className="form-control" defaultValue="0501234567" />
        </div>
        
        <div className="mb-3">
          <label className="form-label">البريد الإلكتروني</label>
          <input type="email" className="form-control" defaultValue="info@alanwar.com" />
        </div>
        
        <div className="mb-3">
          <label className="form-label">العنوان</label>
          <div className="input-group">
            <input type="text" className="form-control" defaultValue="الرياض، المملكة العربية السعودية" />
            <span className="input-group-text">
              <i className="fas fa-map-marker-alt"></i>
            </span>
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">نوع النشاط التجاري</label>
          <select className="form-select">
            <option>تجارة التجزئة</option>
            <option>تجارة الجملة</option>
            <option>خدمات</option>
            <option>تصنيع</option>
          </select>
        </div>
        
        <div className="d-grid gap-2">
          <button type="button" className="btn btn-teal">حفظ التغييرات</button>
          <button 
            type="button" 
            className="btn btn-outline-secondary"
            onClick={() => setCurrentScreen('merchants')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );

  const VisitReportScreen = () => (
    <div className="container-fluid p-3">
      <div className="d-flex align-items-center mb-3">
        <button 
          className="btn btn-link p-0 me-3"
          onClick={() => setCurrentScreen('merchants')}
        >
          <i className="fas fa-arrow-right text-navy"></i>
        </button>
        <h5 className="mb-0">تقرير الزيارة</h5>
      </div>
      
      <form>
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">التاريخ</label>
            <input type="date" className="form-control" defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="col-6">
            <label className="form-label">الوقت</label>
            <input type="time" className="form-control" defaultValue={new Date().toTimeString().slice(0,5)} />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">تقييم الزيارة</label>
          <div className="d-flex gap-2 mt-2">
            {renderStars(rating, true)}
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">ملاحظات</label>
          <textarea className="form-control" rows={4} placeholder="أضف ملاحظاتك هنا..."></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">إرفاق ملفات</label>
          <div className="border border-dashed border-2 p-4 text-center">
            <i className="fas fa-cloud-upload-alt text-teal fa-2x mb-2"></i>
            <p className="text-muted">اضغط لإرفاق صور أو فيديوهات</p>
            <input type="file" className="d-none" accept="image/*,video/*" multiple />
          </div>
        </div>
        
        <div className="mb-3">
          <label className="form-label">التوقيع</label>
          <div className="signature-pad">
            <span>اضغط للتوقيع</span>
          </div>
        </div>
        
        <div className="d-grid">
          <button type="button" className="btn btn-teal btn-lg">إرسال التقرير</button>
        </div>
      </form>
    </div>
  );

  const PackagesScreen = () => (
    <div className="container-fluid p-3">
      <div className="text-center mb-4">
        <h4 className="text-navy">اختر الباقة المناسبة</h4>
        <p className="text-muted">جميع الباقات تتطلب إشعار مسبق 3 أشهر</p>
      </div>
      
      <div className="row g-3 mb-4">
        {packages.map(pkg => (
          <div key={pkg.id} className="col-12 col-md-6">
            <div 
              className={`package-card ${selectedPackage === pkg.id ? 'selected' : ''}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <i className={`${pkg.icon} fa-2x text-teal mb-3`}></i>
              <h6 className="mb-2">{pkg.name}</h6>
              <p className="text-teal fw-bold mb-0">{pkg.price}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPackage && (
        <div className="d-grid">
          <button className="btn btn-teal btn-lg">تأكيد الاشتراك</button>
        </div>
      )}
    </div>
  );

  const BottomNav = () => (
    <div className="bottom-nav">
      <div className="d-flex justify-content-around">
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'merchants' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('merchants')}
        >
          <div><i className="fas fa-home"></i></div>
          <div>الرئيسية</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'visitReport' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('visitReport')}
        >
          <div><i className="fas fa-clipboard-list"></i></div>
          <div>الزيارات</div>
        </a>
        <a href="#" className="nav-item">
          <div><i className="fas fa-plus-circle"></i></div>
          <div>إضافة</div>
        </a>
        <a href="#" className="nav-item">
          <div><i className="fas fa-map-marked-alt"></i></div>
          <div>الخريطة</div>
        </a>
        <a 
          href="#" 
          className={`nav-item ${currentScreen === 'packages' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('packages')}
        >
          <div><i className="fas fa-user-circle"></i></div>
          <div>الملف الشخصي</div>
        </a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-light" dir="rtl">
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen !== 'login' && (
        <>
          {currentScreen === 'merchants' && <MerchantsScreen />}
          {currentScreen === 'merchantDetail' && <MerchantDetailScreen />}
          {currentScreen === 'visitReport' && <VisitReportScreen />}
          {currentScreen === 'packages' && <PackagesScreen />}
          <BottomNav />
        </>
      )}
    </div>
  );
};

export default Index;
