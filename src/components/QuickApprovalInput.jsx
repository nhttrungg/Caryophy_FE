import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const QuickApprovalInput = ({ orderCodes, setOrderCodes }) => {
    const [searchInput, setSearchInput] = useState('');

    const handleAddOrderId = () => {
        if (searchInput.trim() && !orderCodes.includes(searchInput.trim())) {
            setOrderCodes(prev => [...prev, searchInput.trim()]);
            setSearchInput('');
        }
    };

    const handleRemoveOrderId = (orderToRemove) => {
        setOrderCodes(prev => prev.filter(order => order !== orderToRemove));
    };

    return (
        <div className="mt-3 text-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Phê duyệt nhanh</h3>
            <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500 mb-3">
                    Thêm mã đơn hàng cần phê duyệt.
                </p>
                <div className="flex items-center mb-4">
                    <input
                        type="text"
                        className="flex-grow px-4 py-2 text-gray-700 border rounded-l-lg focus:outline-none focus:border-blue-500"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Nhập mã đơn hàng"
                    />
                    <button
                        onClick={handleAddOrderId}
                        className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    >
                        <FiSearch />
                    </button>
                </div>
                <div className="space-y-2">
                    {orderCodes.map((order, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                            <span className="text-sm text-gray-700">{order}</span>
                            <button
                                onClick={() => handleRemoveOrderId(order)}
                                className="text-red-500 hover:text-red-700 focus:outline-none"
                            >
                                <FiX />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuickApprovalInput;