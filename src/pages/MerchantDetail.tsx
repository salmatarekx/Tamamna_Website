
import React from 'react';
import './MerchantDetail.css';

interface MerchantDetailProps {
  onNavigate: (screen: string) => void;
}

const MerchantDetail: React.FC<MerchantDetailProps> = ({ onNavigate }) => {
  return (
    <div className="container-fluid p-3">
      <div className="d-flex align-items-center mb-3">
        <button 
          className="btn btn-link p-0 me-3"
          onClick={() => onNavigate('merchants')}
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
            onClick={() => onNavigate('merchants')}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default MerchantDetail;
