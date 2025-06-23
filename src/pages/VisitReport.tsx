
import React, { useState } from 'react';
import './VisitReport.css';

interface VisitReportProps {
  onNavigate: (screen: string) => void;
}

const VisitReport: React.FC<VisitReportProps> = ({ onNavigate }) => {
  const [rating, setRating] = useState(0);

  const renderStars = (ratingValue: number, isClickable = false) => {
    return [1, 2, 3, 4, 5].map(star => (
      <i
        key={star}
        className={`fas fa-star rating-stars ${star <= ratingValue ? 'text-warning' : 'text-muted'}`}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        onClick={isClickable ? () => setRating(star) : undefined}
      />
    ));
  };

  return (
    <div className="container-fluid p-3">
      <div className="d-flex align-items-center mb-3">
        <button 
          className="btn btn-link p-0 me-3"
          onClick={() => onNavigate('dashboard')}
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
          <div className="border border-dashed border-2 p-4 text-center file-upload-area">
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
};

export default VisitReport;
