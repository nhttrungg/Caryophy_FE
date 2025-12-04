import React from 'react';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiArrowLeft } from 'react-icons/fi';

const OrderUserDetail = ({ order, onBackClick }) => {
  const statusSteps = ['PENDING', 'DOING', 'SHIPPING', 'DONE'];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <FiClock className="text-yellow-500" />;
      case 'DOING': return <FiPackage className="text-blue-500" />;
      case 'SHIPPING': return <FiTruck className="text-purple-500" />;
      case 'DONE': return <FiCheckCircle className="text-green-500" />;
      default: return null;
    }
  };

  const currentStatusIndex = statusSteps.indexOf(order.status);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <button 
        onClick={onBackClick}
        className="mb-4 text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
      >
        <FiArrowLeft className="mr-2" />
        Quay lại danh sách đơn hàng
      </button>
  
      <h2 className="text-2xl font-bold mb-4">Chi tiết đơn hàng #{order.id}</h2>
  
      {/* Status Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStatusIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}>
                {getStatusIcon(step)}
              </div>
              <span className="text-xs mt-1">{step}</span>
            </div>
          ))}
        </div>
        <div className="relative">
          <div className="absolute top-0 h-1 bg-gray-300 w-full"></div>
          <div 
            className="absolute top-0 h-1 bg-blue-500 transition-all duration-500"
            style={{ width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
  
      {/* Order Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="font-semibold">Mã đơn hàng:</p>
          <p>{order.id}</p>
        </div>
        <div>
          <p className="font-semibold">Ngày đặt hàng:</p>
          <p>{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="font-semibold">Tổng tiền:</p>
          <p>{order.totalAmount.toLocaleString()} VND</p>
        </div>
        <div>
          <p className="font-semibold">Trạng thái:</p>
          <p>{order.status}</p>
        </div>
      </div>
  
      {/* Product List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Sản phẩm</h3>
        {order.products.map((variant, index) => (
          <div key={index} className="flex items-center mb-4 border-b pb-4">
            <img 
              src={variant.image || 'https://via.placeholder.com/50'}
              alt={variant.name}
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div>
              <p className="font-medium">{variant.name}</p>
              <p className="text-sm text-gray-500">Số lượng: {variant.quantity}</p>
              <p className="text-sm text-gray-500">Giá: {variant?.price?.toLocaleString()} VND</p>
            </div>
          </div>
        ))}
      </div>
  
      {order.status === 'SHIPPING' && (
        <button 
          onClick={() => {/* Handle received order */}}
          className="mt-6 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200"
        >
          Đã nhận được hàng
        </button>
      )}
    </div>
  );
};

export default OrderUserDetail;