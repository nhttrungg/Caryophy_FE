import React from 'react';
import { FiStar, FiShoppingCart } from 'react-icons/fi';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative">
                <img
                    src={product.image && product.image.length > 0 ? product.image[0].url : 'default-image-url.jpg'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                />
                {product.isDiscount && (
                    <span className="absolute top-0 left-0 bg-red-500 text-white px-2 py-1 text-xs font-bold">SALE</span>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                <div className="flex items-center mb-2">
                    <FiStar className="text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{product.rating.toFixed(1)}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">Đã bán: {product.sold}</p>
                <p className="text-sm text-gray-600 mb-4">Danh mục: {product.category.name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ${product.groupOptions[0].price.toFixed(2)}
                  </span>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition duration-300">
                        <FiShoppingCart className="inline-block mr-1" /> Thêm vào giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;