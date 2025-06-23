
import React from 'react';
import './Merchants.css';

interface MerchantProps {
  onNavigate: (screen: string) => void;
}

const renderStars = (ratingValue: number) => {
  return [1, 2, 3, 4, 5].map(star => (
    <i
      key={star}
      className={`fas fa-star rating-stars ${star <= ratingValue ? 'text-warning' : 'text-muted'}`}
    />
  ));
};

const Merchants: React.FC<MerchantProps> = ({ onNavigate }) => {
  const merchants = [
    { id: 1, name: 'متجر الأنوار', phone: '0501234567', rating: 4.5 },
    { id: 2, name: 'مؤسسة الرياض التجارية', phone: '0507654321', rating: 4.2 },
    { id: 3, name: 'شركة الخليج للتجارة', phone: '0509876543', rating: 4.8 }
  ];

  return (
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
            onClick={() => onNavigate('merchantDetail')}
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
};

export default Merchants;
