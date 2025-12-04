import React from 'react';
import { FiEdit, FiTrash, FiStar, FiShoppingCart, FiImage } from 'react-icons/fi';

const ProductCardAdmin = ({ product, handleProductClick }) => {
  const imageUrl = product.image && product.image.length > 0 ? product.image[0].path : null;

  return (
    <div
      className="bg-white rounded-lg shadow-md overflow-hidden flex mb-4 cursor-pointer hover:shadow-xl transition-shadow duration-300 border border-gray-200"
      onClick={handleProductClick}
    >
      <div className="w-40 h-40 relative bg-gray-100 flex items-center justify-center flex-shrink-0">
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full w-full text-gray-400">
            <FiImage size={36} />
            <span className="text-xs mt-2">No Image</span>
          </div>
        )}
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg">
          ID: {product.id}
        </div>
      </div>
      <div className="flex-grow p-4 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">{product.name}</h3>
          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <FiShoppingCart className="mr-1" />
            <span>Đã bán: {product.sold || 0}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FiStar className="mr-1 text-yellow-400" />
            <span>Đánh giá: {product.rating || 0}</span>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="text-blue-500 hover:text-blue-600 mr-3">
            <FiEdit size={18} />
          </button>
          <button className="text-red-500 hover:text-red-600">
            <FiTrash size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardAdmin;