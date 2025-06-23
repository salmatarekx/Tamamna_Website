
import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="container-fluid p-3">
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h4 className="text-navy mb-1">مرحباً بك في تممنا</h4>
            <p className="text-muted mb-0">لوحة التحكم الرئيسية</p>
          </div>
          <img 
            src="/tmmna-logo.png" 
            alt="TMMNA" 
            style={{ width: '50px', height: 'auto' }}
          />
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-users text-teal fa-2x mb-2"></i>
              <h5 className="text-navy mb-1">150</h5>
              <small className="text-muted">إجمالي التجار</small>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-clipboard-check text-teal fa-2x mb-2"></i>
              <h5 className="text-navy mb-1">45</h5>
              <small className="text-muted">زيارات اليوم</small>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-chart-line text-teal fa-2x mb-2"></i>
              <h5 className="text-navy mb-1">85%</h5>
              <small className="text-muted">معدل النجاح</small>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body text-center">
              <i className="fas fa-star text-warning fa-2x mb-2"></i>
              <h5 className="text-navy mb-1">4.7</h5>
              <small className="text-muted">متوسط التقييم</small>
            </div>
          </div>
        </div>
      </div>

      {/* الإجراءات السريعة */}
      <div className="mb-4">
        <h6 className="text-navy mb-3">الإجراءات السريعة</h6>
        <div className="row g-3">
          <div className="col-6">
            <button 
              className="btn btn-outline-teal w-100 h-100 py-3"
              onClick={() => onNavigate('merchants')}
            >
              <i className="fas fa-users fa-2x mb-2 d-block"></i>
              <span>إدارة التجار</span>
            </button>
          </div>
          <div className="col-6">
            <button 
              className="btn btn-outline-teal w-100 h-100 py-3"
              onClick={() => onNavigate('visitReport')}
            >
              <i className="fas fa-plus-circle fa-2x mb-2 d-block"></i>
              <span>زيارة جديدة</span>
            </button>
          </div>
        </div>
      </div>

      {/* آخر الزيارات */}
      <div className="mb-4">
        <h6 className="text-navy mb-3">آخر الزيارات</h6>
        <div className="list-group">
          <div className="list-group-item border-0 bg-light mb-2 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">متجر الأنوار</h6>
                <small className="text-muted">منذ ساعتين</small>
              </div>
              <span className="badge bg-success">مكتملة</span>
            </div>
          </div>
          <div className="list-group-item border-0 bg-light mb-2 rounded">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">مؤسسة الرياض</h6>
                <small className="text-muted">منذ 4 ساعات</small>
              </div>
              <span className="badge bg-warning">قيد المراجعة</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
