import React, { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from '../Modal';
import useAxiosSupport from '../../hooks/useAxiosSupport';
import {AddCouponForm} from "../../pages/CouponsDashboard";
import AddVoucherForm from "../AddVoucherForm";
import {VoucherCondition, VoucherType} from "../../utils/constObject";

function VoucherAdminDashboard() {
    const axiosSupport = useAxiosSupport();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [vouchers, setVouchers] = useState([]);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    useEffect(() => {
        fetchVouchers();
    }, [axiosSupport]);

    const fetchVouchers = async () => {
        try {
            const vouchersData = await axiosSupport.getVoucherSystem();

            const mappedVouchers = vouchersData.map(voucher => ({
                id: voucher.id,
                code: voucher.code,
                discount: voucher.discount,
                validFrom: voucher.startDate,
                validTo: voucher.expirationDate,
                description: voucher.description,
                minPurchase: voucher.valueCondition,
                maxDiscount: voucher.valueCondition || 0,
                usageLimit: voucher.quantity,
                usageCount: voucher.quantity || 0,
                isActive: voucher.active,
                voucherType: voucher.voucherType,
                voucherCondition: voucher.voucherCondition,
            }));

            mappedVouchers.forEach(voucher => {
                if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'ONLY_CATEGORY') {
                    voucher.conditionValue = voucher.voucherCondition.category?.name || '';
                }
                if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'ONLY_PRODUCT') {
                    voucher.conditionValue = "PRODUCT";
                }
                if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'MIN_COST') {
                    voucher.conditionValue = voucher.voucherCondition.minPrice || '';
                }
            });

            setVouchers(mappedVouchers);
            setTotalPages(Math.ceil(mappedVouchers.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching vouchers:", error);
            toast.error("Failed to load vouchers");
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const onVoucherAdded = (voucher) => {
          voucher = {
            id: voucher.id,
            code: voucher.code,
            discount: voucher.discount,
            validFrom: voucher.startDate,
            validTo: voucher.expirationDate,
            description: voucher.description,
            minPurchase: voucher.valueCondition,
            maxDiscount: voucher.valueCondition || 0,
            usageLimit: voucher.quantity,
            usageCount: voucher.quantity || 0,
            isActive: voucher.active,
            voucherType: voucher.voucherType,
            voucherCondition: voucher.voucherCondition,
         };
        if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'ONLY_CATEGORY') {
            voucher.conditionValue = voucher.voucherCondition.category?.name || '';
        }
        if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'ONLY_PRODUCT') {
            voucher.conditionValue = "PRODUCT";
        }
        if (voucher.voucherCondition && voucher.voucherCondition.conditionType === 'MIN_COST') {
            voucher.conditionValue = voucher.voucherCondition.minPrice || '';
        }
        setVouchers([voucher,...vouchers]);
        setTotalPages(Math.ceil((vouchers.length + 1) / itemsPerPage));
    }

    const handleEditVoucher = (voucher) => {
        console.log("Editing voucher:", voucher);
    };

    const handleDeleteVoucher = (voucherId) => {
        console.log("Deleting voucher with ID:", voucherId);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentVouchers = vouchers.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen rounded-md">
                <div className="flex-1 lg:p-6 space-y-4 lg:space-y-6 overflow-x-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">Quản lý Voucher</h1>
                    <div className="mb-4 lg:mb-6 flex justify-between items-center p-1">
                        <div className="relative flex items-center w-1/3">
                            <input
                                type="text"
                                placeholder="Tìm kiếm voucher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-md py-2 pl-3 pr-4 text-gray-700 placeholder-gray-500"
                            />
                            <FiSearch size={20}
                                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"/>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEditVoucher(selectedCoupon)}
                                disabled={!selectedCoupon}
                                className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
                            >
                                <FiEdit className="mr-2"/> Chỉnh sửa
                            </button>
                            <button
                                onClick={() => handleDeleteVoucher(selectedCoupon?.id)}
                                disabled={!selectedCoupon}
                                className="flex items-center justify-center bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 disabled:opacity-50"
                            >
                                <FiTrash className="mr-2"/> Xóa
                            </button>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                            >
                                <FiPlus className="mr-2" /> Thêm mới
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-md shadow-md overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã
                                    Voucher
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm
                                    giá
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày
                                    bắt đầu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày
                                    kết thúc
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô
                                    tả
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mua
                                    tối thiểu
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm
                                    tối đa
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới
                                    hạn sử dụng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại
                                    voucher
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng
                                    thái
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điều
                                    kiện
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá trị điêu kiện
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {currentVouchers.map(voucher => (
                                <tr
                                    key={voucher.id}
                                    onClick={() => setSelectedCoupon(voucher)}
                                    className={`cursor-pointer hover:bg-gray-100 ${selectedCoupon?.id === voucher.id ? 'bg-blue-100' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.code}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.discount}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(voucher.validFrom).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(voucher.validTo).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.minPurchase}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.maxDiscount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.usageLimit}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{VoucherType.find(e => e.value === voucher.voucherType).label }</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.isActive ? 'Hoạt động' : 'Không hoạt động'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{VoucherCondition[voucher.voucherCondition.conditionType]}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{voucher.conditionValue}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
            </div>
            <div
                className="flex flex-col sm:flex-row justify-between items-center mt-4 text-gray-600 space-y-2 sm:space-y-0">
                <span className="text-sm">Trang {currentPage} trên {totalPages}</span>
                <div className="flex items-center space-x-2 text-sm">
                    <button
                        onClick={() => handlePageChange(1)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === 1}
                    >
                        &lt;&lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                    <button
                        onClick={() => handlePageChange(totalPages)}
                        className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                        disabled={currentPage === totalPages}
                            >
                                &gt;&gt;
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={()=>{setIsModalOpen(false)}} children={
                <AddVoucherForm
                    setIsModalOpen={setIsModalOpen}
                    onVoucherAdded={onVoucherAdded}
                />
            }>
            </Modal>
        </>
    );
}

// Helper function to generate fake vouchers (remove this when using real API)
function generateFakeVouchers(count) {
    return Array.from({length: count}, (_, i) => ({
        id: i + 1,
        code: `VOUCHER${i + 1}`,
        discount: Math.floor(Math.random() * 50) + 10,
        validFrom: new Date(2023, 0, 1).toISOString(),
        validTo: new Date(2023, 11, 31).toISOString(),
        merchantName: `Merchant ${i + 1}`
    }));
}

export default VoucherAdminDashboard;