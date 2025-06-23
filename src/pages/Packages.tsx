
import React, { useState } from 'react';
import './Packages.css';

const Packages: React.FC = () => {
  const [selectedPackage, setSelectedPackage] = useState('');

  const packages = [
    { id: 'basic', name: 'الباقة الأساسية', price: '100 ر.س / شهر', icon: 'fas fa-box' },
    { id: 'standard', name: 'الباقة المعيارية', price: '200 ر.س / شهر', icon: 'fas fa-boxes' },
    { id: 'premium', name: 'الباقة المتقدمة', price: '300 ر.س / شهر', icon: 'fas fa-crown' },
    { id: 'enterprise', name: 'باقة المؤسسات', price: '500 ر.س / شهر', icon: 'fas fa-building' }
  ];

  return (
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
};

export default Packages;
