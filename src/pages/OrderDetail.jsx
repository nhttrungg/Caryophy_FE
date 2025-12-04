import React, {useEffect, useState} from 'react';
import {FiPackage, FiUser, FiCalendar, FiDollarSign, FiTruck, FiMapPin, FiArrowLeft} from 'react-icons/fi';
import {useNavigate, useParams} from "react-router-dom";
import useAxiosSupport from "../hooks/useAxiosSupport";

const OrderDetail = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const axiosSupport = useAxiosSupport();
    const [order, setOrder] = useState(null);
    const fetchData = async () => {
        const response = await axiosSupport.getOrderById(id);
        setOrder(response);
    }
    useEffect( () => {

         fetchData()
    },[id])

    const getStatusColor = (status) => {
        switch (status) {
          case 'DELIVERED':
            return 'bg-green-100 text-green-800';
          case 'CANCELLED':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-yellow-100 text-yellow-800';
        }
    };


    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/dashboard/order')}
                className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
                <FiArrowLeft className="mr-2"/>
                Quay lại danh sách đơn hàng
            </button>
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Chi tiết đơn hàng #{order?.id}</h2>
                        <div className="space-x-2">
                            <button
                                className={`font-bold py-2 px-4 rounded transition duration-300 ${
                                    order?.status === "PENDING" || order?.status === "DOING"
                                        ? "bg-white text-blue-600 hover:bg-blue-100"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={async () => {
                                    if (order?.status === "PENDING" || order?.status === "DOING") {
                                        await axiosSupport.updateOrder([order.id])
                                        fetchData();
                                    }
                                }}
                                disabled={order?.status !== "PENDING" && order?.status !== "DOING"}
                            >
                                {order?.status === "PENDING" && "Nhận đơn hàng"}
                                {order?.status !== "PENDING" && "Đã gửi hàng"}
                            </button>
                            <button
                                className={`font-bold py-2 px-4 rounded transition duration-300 ${
                                    order?.status === "PENDING"
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                }`}
                                onClick={() => {
                                    if (order?.status === "PENDING") {

                                    }
                                }}
                                disabled={order?.status !== "PENDING"}
                            >
                                Không nhận đơn
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FiUser className="text-blue-500 mr-2"/>
                                <span className="font-semibold">Khách hàng:</span>
                                <span className="ml-2">{order?.customerName}</span>
                            </div>
                            <div className="flex items-center">
                                <FiCalendar className="text-blue-500 mr-2"/>
                                <span className="font-semibold">Ngày đặt hàng:</span>
                                <span className="ml-2">{new Date(order?.orderDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                                <FiDollarSign className="text-blue-500 mr-2"/>
                                <span className="font-semibold">Tổng tiền:</span>
                                <span className="ml-2">{order?.total.toLocaleString()} VND</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <FiPackage className="text-blue-500 mr-2"/>
                                <span className="font-semibold">Mã đơn hàng:</span>
                                <span className="ml-2">#{order?.id}</span>
                            </div>
                            <div className="flex items-center">
                                <FiTruck className="text-blue-500 mr-2"/>
                                <span className="font-semibold">Trạng thái:</span>
                                <span
                                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order?.status)}`}
                                >
                                    {order?.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-2">Địa chỉ giao hàng</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center">
                                <FiMapPin className="text-blue-500 mr-2"/>
                                <p>
                                    {order?.address}
                                </p>
                            </div>
                        </div>
                    </div>


                    <div className="mt-8">
                        <h3 className="text-lg font-semibold mb-4">Sản phẩm trong đơn hàng</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Phân Loại sản phẩm
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn giá</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thành tiền</th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {order?.variants && order.variants.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <img src={item?.image?.path || 'placeholder-image-url.jpg'}
                                                 alt={item?.product?.name} 
                                                 className="h-16 w-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item?.product?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item?.options.map(option => option.name).join(", ")}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item?.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item?.price.toLocaleString()} VND</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{(item?.quantity * item.price).toLocaleString()} VND</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default OrderDetail;