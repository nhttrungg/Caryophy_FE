import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import useAxiosSupport from "../hooks/useAxiosSupport";
import UserOrderList from "../components/UserOrderList";
import OrderUserDetail from "../components/OrderUserDetail";
import {toast} from "react-toastify";

const UserOrderPage = () => {
    const id = useSelector(state => state.user.id);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageable, setPageable] = useState(1);
    const [loading, setLoading] = useState(false);
    const axiosInstance = useAxiosSupport();
    const [selectedStatus, setSelectedStatus] = useState('PENDING');


    const PAGE_SIZE = 5;

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.getOrdersByUserId(id,currentPage,PAGE_SIZE,selectedStatus);
            const formattedOrders = response.content.map(order => ({
                id: order.orderCode,
                status:  order.status,
                orderDate: new Date(order.orderDate).toISOString(),
                totalAmount: order.total,
                products: order.variants.map(variant => ({
                    name: variant?.product?.name,
                    image: variant?.image?.path || '',
                    quantity: variant?.quantity
                }))
            }));
            const uniqueOrders = [...new Map([...orders, ...formattedOrders].map(order => [order.id, order])).values()];
            setOrders(uniqueOrders);
            setTotalPages(Math.ceil(response.totalPages));
            setPageable(Math.ceil(orders.length / PAGE_SIZE));
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error("Có lỗi xảy ra khi tải đơn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
            fetchOrders();
    }, [selectedStatus]);

    useEffect(() => {
        if(currentPage > pageable){
            fetchOrders();
        }
    }, [currentPage]);

    const handleOrderSelect = (order) => {
        setSelectedOrder(order);
    }

    const handleBackToList = () => {
        setSelectedOrder(null);
    }
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Đơn hàng của tôi</h1>
            {selectedOrder ? (
                <OrderUserDetail
                    order={selectedOrder}
                    onBackClick={handleBackToList}
                />
            ) : (
                <UserOrderList
                    orders={orders}
                    handleOrderSelect={handleOrderSelect}
                    handlePageChange={handlePageChange}
                    totalPages={totalPages}
                    currentPage={currentPage}
                    isLoad={loading}
                    selectedStatus={selectedStatus}
                    setSelectedStatus={setSelectedStatus}
                    pageSize={PAGE_SIZE}
                />
            )}
        </div>
    );
};

export default UserOrderPage;