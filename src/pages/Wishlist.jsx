import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAxiosSupport from "../hooks/useAxiosSupport";
import { FaHeart, FaStore, FaTrash } from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const Wishlist = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 9;
  const axiosSupport = useAxiosSupport();

  const user = useSelector(state => state.user);

    useEffect(() => {
        fetchWishlistData();
    }, [activeTab, currentPage, user.id, axiosSupport, itemsPerPage]);

    const navigate = useNavigate();

  const fetchWishlistData = async () => {
    setIsLoading(true);
    try {
      const response = await axiosSupport.getWishlist(user.id, activeTab, currentPage, itemsPerPage);
      if (activeTab === 'products') {
        setItems(response.products || []);
      } else if (activeTab === 'shops') {
        setItems(response.shops || []);
      }
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error fetching wishlist data:', error);
      setItems([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axiosSupport.removeFromWishlist(user.id, itemId, activeTab);
      fetchWishlistData();
    } catch (error) {
      console.error('Error removing item from wishlist:', error);
    }
  };

    const renderCard = (item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105" onClick={()=> {
            activeTab === 'products'? navigate(`/client/details/${item.id}`) : navigate(`/shop/${item.id}`) 
        }}>
            <div className="relative">
                <img
                    src={activeTab === 'products'
                        ? (item.image && item.image.length > 0 ? item.image[0].path : '/path/to/default/product-image.jpg')
                        : (item.logo ? item.logo.path : '/path/to/default/shop-image.jpg')
                    }
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
                <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300 transform hover:scale-110"
                    aria-label="Remove from wishlist"
                >
                    <FaTrash className="w-4 h-4" />
                </button>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-lg mb-2 truncate text-gray-800">{item.name}</h3>
                {activeTab === 'products' ? (
                    <div className="flex justify-between items-center">
                        <p className="text-blue-600 font-semibold">
                            {item?.category?.name || 0}
                        </p>
                        <span className="text-sm text-gray-500">
                            {item.rating ? `${item.rating.toFixed(1)} ★` : 'Chưa có đánh giá'}
                        </span>
                    </div>
                ) : (
                    <div>
                        <p className="text-gray-600 truncate mb-2">{item.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <FaStore className="mr-1" />
                            <span>{item.totalSold || 0} sản phẩm đã bán</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách yêu thích</h1>
      <div className="flex justify-center mb-8">
        <button
          className={`mx-2 px-6 py-2 rounded-full flex items-center ${activeTab === 'products' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
          onClick={() => handleTabChange('products')}
        >
          <FaHeart className="mr-2" /> Sản phẩm
        </button>
        <button
          className={`mx-2 px-6 py-2 rounded-full flex items-center ${activeTab === 'shops' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
          onClick={() => handleTabChange('shops')}
        >
          <FaStore className="mr-2" /> Người bán
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => renderCard(item))}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl">Không có {activeTab === 'products' ? 'sản phẩm' : 'người bán'} nào trong danh sách yêu thích.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={`mx-1 px-4 py-2 rounded-full ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition-colors duration-300`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;