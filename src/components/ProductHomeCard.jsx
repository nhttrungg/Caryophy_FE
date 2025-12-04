import React from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/reducers/cartReducer';
import useAxiosSupport from '../hooks/useAxiosSupport';
import {useNavigate} from "react-router-dom";

const HomeProductCard = ({ item }) => {
    const navigate  = useNavigate();
    const handleProductClick = (item) => {
        navigate(`/product/${item.id}`);
    };
    const dispatch = useDispatch();
    const axiosSupport = useAxiosSupport();

    const handleAddToCart = async (e) => {
        e.stopPropagation();
        const variant = await axiosSupport.getOneVariant(item.id);
        dispatch(addToCart(variant));
    };

    return (
        <div
            className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow w-full max-w-[250px] sm:max-w-[300px] md:max-w-[350px] mx-auto mb-8 sm:mb-10 md:mb-12 cursor-pointer"
            onClick={() => handleProductClick(item)}
        >
            <div className="relative mb-3 sm:mb-4">
                <img
                    src={item?.image?.[0]?.path || 'https://via.placeholder.com/300?text=No+Image'}
                    alt={item.name || 'Product Image'}
                    className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300?text=No+Image';
                    }}
                />
                {item.isDiscount && (
                    <span className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold">
            Sale
          </span>
                )}
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-800 truncate">{item?.name}</h3>
            <p className="text-gray-600 mb-2 text-xs sm:text-sm md:text-base line-clamp-2">{item?.description}</p>
            <div className="flex justify-between items-center mb-2 sm:mb-3">
        <span className="text-base sm:text-lg font-bold text-[#0b328f]">
          ${item?.minPrice || 0} - ${item?.maxPrice || 0}
        </span>
                <span className="text-xs sm:text-sm text-gray-500">Đã bán: {item?.sold || 0}</span>
            </div>
            <div className="flex items-center mb-3 sm:mb-4">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="text-sm text-gray-600">{item?.rating?.toFixed(1) || 0}</span>
            </div>
            <button
                className="w-full bg-[#0b328f] text-white py-1.5 sm:py-2 rounded text-xs sm:text-sm md:text-base hover:bg-[#092569] transition-colors"
                onClick={handleAddToCart}
            >
                Thêm vào giỏ hàng
            </button>
        </div>
    );
};

export default HomeProductCard;