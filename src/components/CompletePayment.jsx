import React from 'react';
import { FiCheckCircle } from 'react-icons/fi';
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

const CompletePayment = ({ orders }) => {
    const id = useSelector(state=>state.user.id);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    const navigate = useNavigate();

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING':
                return 'text-yellow-600';
            case 'COMPLETED':
                return 'text-green-600';
            default:
                return 'text-gray-600';
        }
    };

    const getPaymentTypeText = (type) => {
        switch (type) {
            case 'BANK_TRANSFER':
                return 'Chuyển khoản ngân hàng';
            case 'CASH_ON_DELIVERY':
                return 'Thanh toán khi nhận hàng';
            default:
                return type;
        }
    };

    const totalAmount = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-6">
                <FiCheckCircle className="text-green-500 text-5xl mr-3" />
                <h2 className="text-2xl font-bold text-green-600">Đặt hàng thành công</h2>
            </div>

            {orders.map((order, index) => (
                <div key={order.id} className="mb-6 border-b pb-6 last:border-b-0">
                    <h3 className="text-xl font-semibold mb-3">Thông tin đơn hàng #{index + 1}</h3>
                    <div className="bg-gray-100 p-4 rounded-lg">
                        <p><span className="font-medium">Mã đơn hàng:</span> #{order.id}</p>
                        <p><span className="font-medium">Ngày đặt hàng:</span> {formatDate(order.orderDate)}</p>
                        <p><span className="font-medium">Cửa hàng:</span> {order.merchantName}</p>
                        <p><span className="font-medium">Trạng thái:</span> <span className={getStatusColor(order.status)}>{order.status}</span></p>
                        <p><span className="font-medium">Tổng cộng:</span> {order.total.toLocaleString()} VND</p>
                        <p><span className="font-medium">Phương thức thanh toán:</span> {getPaymentTypeText(order.paymentType)}</p>
                        <p><span className="font-medium">Địa chỉ giao hàng:</span> {order.address}</p>
                    </div>
                </div>
            ))}

            <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-lg font-semibold">Tổng cộng tất cả đơn hàng:</p>
                    <p className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()} VND</p>
                </div>
            </div>

            <button
                className="mt-6 w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 text-lg"
                onClick={()=>{id ? navigate('/client/cart') : navigate('/cart')}}
            >
                Tiếp tục mua sắm
            </button>
        </div>
    );
};

export default CompletePayment;