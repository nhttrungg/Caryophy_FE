import React, {useState, useEffect, useMemo} from 'react';
import {FiSearch, FiFilter, FiRefreshCw, FiChevronLeft, FiChevronRight, FiCheck} from 'react-icons/fi';
import useAxiosSupport from '../hooks/useAxiosSupport';
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setOrderPage} from "../redux/reducers/commonReducer";
import Modal from "../components/Modal";
import QuickApprovalInput from "../components/QuickApprovalInput";
import websocketConfig from "../config/websocketConfig";
import {OrderStatus} from "../utils/constObject";
const OrderDashboard = () => {
    const orderInit = useSelector(state => state.merchant.orders);

    const [orders, setOrders] = useState(orderInit || []);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1 );
    const [ordersPerPage] = useState(10);
    const [newOrderIds, setNewOrderIds] = useState(new Set());

    const axiosSupport = useAxiosSupport();
    const merchant = useSelector(state => state.merchant);
    const user = useSelector(state => state.user);
    const [maxPage, setMaxPage] = useState(1);
    const navigate = useNavigate();

    const [hasMore, setHasMore] = useState(true);

    const dispatch = useDispatch();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderCodes, setOrderCodes] = useState([]);

    const [searchCode, setSearchCode] = useState('');
    const [searchedCodes, setSearchedCodes] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCode && !searchedCodes.includes(searchCode)) {
            setSearchedCodes([...searchedCodes, searchCode]);
            setSearchCode('');
        }
    };

    const removeSearchedCode = (code) => {
        setSearchedCodes(searchedCodes.filter(c => c !== code));
    };



    const handleQuickApprove = async () => {
        const ids = orders.filter(order => order.status === 'PENDING').map(order => order.id);
        await axiosSupport.updateOrder(ids);
        orders.filter(order => order.status === 'PENDING').forEach(order => {order.status = 'DOING'});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setOrderCodes([]);
    };

    const submitQuickApprove = () => {
        const codes = orderCodes.split(',').map(code => code.trim());
        console.log("Order codes to approve:", codes);
        closeModal();
    };

    const onOrderReceived = (newOrder) => {
        setOrders(prevOrders => {
            const updatedOrders = [newOrder, ...prevOrders];
            return updatedOrders.filter((order, index, self) =>
                index === self.findIndex((t) => t.id === order.id)
            );
        });
    };


    useEffect(() => {
        websocketConfig.connect(user.id, {
            onOrderReceived: (newOrder) => {
                const transformedOrder = {
                    id: parseInt(newOrder.id),
                    customerName: newOrder.customerName || "Khách vãng lai",
                    orderDate: newOrder.orderDate,
                    totalAmount: parseFloat(newOrder.total),
                    status: newOrder.status
                };
                setOrders(prevOrders => {
                    const updatedOrders = [transformedOrder, ...prevOrders];
                    return updatedOrders.filter((order, index, self) =>
                        index === self.findIndex((t) => t.id === order.id)
                    );
                });
                setNewOrderIds(prev => new Set(prev).add(transformedOrder.id));
                setTimeout(() => {
                    setNewOrderIds(prev => {
                        const updated = new Set(prev);
                        updated.delete(transformedOrder.id);
                        return updated;
                    });
                }, 1000);
            }
        });

        return () => {
            websocketConfig.disconnect();
        };
    }, [user.id]);

    useEffect(() => {
        fetchOrders(currentPage);
    }, []);

    const fetchOrders = async (pageNumber) => {
        try {
            const response = await axiosSupport.getOrdersByShopId(merchant.id, pageNumber-1, ordersPerPage);
            const transformedOrders = response.map(order => ({
                id: parseInt(order.id),
                customerName: order.customerName || "Khách vãng lai",
                orderDate: order.orderDate,
                totalAmount: parseFloat(order.total),
                status: order.status
            }));

            setOrders(prevOrders => {
                const uniqueOrders = [...prevOrders, ...transformedOrders].reduce((acc, current) => {
                    const x = acc.find(item => item.id === current.id);
                    if (!x) {
                        return acc.concat([current]);
                    } else {
                        return acc;
                    }
                }, []);
                return uniqueOrders;
            });
            setMaxPage(Math.ceil(orders.length / ordersPerPage))

            if (transformedOrders.length < ordersPerPage) {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setHasMore(false);
        }
    };

    const refreshOrders = () => {
        fetchOrders(currentPage);
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order =>
            (order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.id.toString().includes(searchTerm)) &&
            (statusFilter === 'ALL' || order.status === statusFilter)
        );
    }, [orders, searchTerm, statusFilter]);

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = useMemo(() => {
        return filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    }, [currentPage, ordersPerPage, filteredOrders]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        if (pageNumber > maxPage) {
            setMaxPage(pageNumber);
            fetchOrders(pageNumber);
        }
    }

    return (
        <div>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Quản lý đơn hàng</h1>
                    <p className="text-blue-100">Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>

                <div className="p-6">
                    <div className="flex flex-col space-y-4 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <div className="w-full sm:w-auto relative">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm đơn hàng..."
                                    className="border p-2 pl-10 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-center sm:justify-end w-full sm:w-auto space-x-2 sm:space-x-4">
                                <div className="relative w-full sm:w-auto mb-2 sm:mb-0">
                                    <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                    <select
                                        className="border p-2 pl-10 rounded-full w-full appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="ALL">Tất cả trạng thái</option>
                                        <option value="PENDING">Chờ xử lý</option>
                                        <option value="DOING">Đang xử lý</option>
                                        <option value="SHIPPING">Đã gửi hàng</option>
                                        <option value="CANCEL">Đã hủy</option>
                                    </select>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={refreshOrders}
                                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <FiRefreshCw className="w-5 h-5"/>
                                    </button>
                                    <button
                                        onClick={handleQuickApprove}
                                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-full transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                                    >
                                        <FiCheck className="w-5 h-5 mr-2"/>
                                        <span className="hidden sm:inline">Phê duyệt nhanh</span>
                                        <span className="sm:hidden">Duyệt nhanh</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Ngày đặt</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Tổng tiền</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => (
                                <tr
                                    key={order.id}
                                    className={`transition-all duration-500 ${newOrderIds.has(order.id) ? 'flash-blue-animation' : ''}`}
                                    onClick={() => navigate(`/dashboard/merchant/order/${order.id}`)}
                                >
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hover:text-blue-600">#{order.id}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hover:text-gray-900">{order?.customerName || ""}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell hover:text-gray-900">
                                        {new Date(order.orderDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell hover:text-gray-900">
                                        {order.totalAmount.toLocaleString()} VND
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                order.status === 'DONE' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                                                    order.status === 'SHPPING' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                                                        order.status === 'DOING' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                                                            order.status === 'PENDING' ? 'bg-gray-100 text-gray-800 hover:bg-gray-200' :
                                                                'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                            } transition-colors duration-200 ease-in-out`}
                                        >
                                            {order.status === 'PENDING' && 'Chờ xử lý'}
                                            {order.status === 'DOING' && 'Đang xử lý'}
                                            {order.status === 'SHIPPING' && 'Đang giao hàng'}
                                            {order.status === 'DONE' && 'Hoàn thành'}
                                            {!['PENDING', 'DOING', 'SHIPPING', 'DONE'].includes(order.status) && order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Trang trước
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Trang sau
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Hiển thị <span className="font-medium">{indexOfFirstOrder + 1}</span> tới <span
                                    className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> trên {' '}
                                    <span className="font-medium">{filteredOrders.length}</span> kết quả
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                     aria-label="Pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        <FiChevronLeft className="h-5 w-5" aria-hidden="true"/>
                                    </button>
                                    {(() => {
                                        const pageNumbers = [];
                                        const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

                                        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
                                            pageNumbers.push(
                                                <button
                                                    key={i}
                                                    onClick={() => paginate(i)}
                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                        currentPage === i
                                                            ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {i}
                                                </button>
                                            );
                                        }

                                        return pageNumbers;
                                    })()}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        <FiChevronRight className="h-5 w-5" aria-hidden="true"/>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDashboard;